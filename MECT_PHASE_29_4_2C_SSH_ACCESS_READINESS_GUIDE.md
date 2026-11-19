# MECT PHASE 29.4.2C — SSH ACCESS READINESS & SETUP GUIDE
## Forensic Connection Analysis, Key Discovery, Security Hardening & Windows Setup Instructions

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Target VPS Host:** `200.97.161.128` (`srv2000528`)  
**Production Domain:** https://mect.org.in/  
**Audit Evaluation Date:** 2026-11-20T00:15:00+05:30 (UTC: 2026-11-19T18:45:00Z)  
**Phase:** Phase 29.4.2C — Evidence Reconciliation & Owner-Assisted Access Readiness  

---

## 1. FORENSIC CONNECTION ANALYSIS & FAILURE DIAGNOSIS

During Phase 29.4.2B, direct inspection of the production VPS was attempted from the local workstation. The connection failed at two distinct cryptographic and authentication layers:

### 1.1 Layer 1: Key Exchange (KEX) Mismatch
- **Symptom:** OpenSSH client on Windows reported:
  ```
  choose_kex: unsupported KEX method sntrup761x25519-sha512@openssh.com
  ```
- **Technical Explanation:**
  - The remote VPS runs modern OpenSSH 10.2p1 on Ubuntu 26.04 (`SSH-2.0-OpenSSH_10.2p1 Ubuntu-2ubuntu3.8`).
  - OpenSSH 10.2p1 defaults to post-quantum hybrid key exchange `sntrup761x25519-sha512@openssh.com`.
  - The workstation Windows OpenSSH client (v9.5p2) lacks support for this hybrid KEX by default.
- **Remediation:** Enforce standard Curve25519 key exchange without weakening security:
  ```
  -o KexAlgorithms=curve25519-sha256
  ```

### 1.2 Layer 2: Authentication Denial
- **Symptom:** Handshake succeeded, host key was registered in `known_hosts`, but the server returned:
  ```
  root@200.97.161.128: Permission denied (publickey,password).
  ```
- **Investigation of Local SSH Directory (`C:\Users\himan\.ssh\`):**
  - Executed metadata inspection:
    ```
    Name         Length  LastWriteTime
    ----         ------  -------------
    known_hosts      97  19-11-2026 23:59:53
    ```
  - **Finding:** Only `known_hosts` is present.
  - **Zero Private Keys:** No `id_ed25519`, `id_rsa`, or any other private key exists in `C:\Users\himan\.ssh\`.
  - **No Active SSH Agent:** No `ssh-agent` service is running in this session.
  - **Non-Interactive Environment:** The remote server offered password authentication, but automated background processes cannot respond to interactive password prompts.

---

## 2. VERIFIED HOST IDENTITY & FINGERPRINT

The production host identity has been captured and validated:

- **Host IPv4:** `200.97.161.128` (Port: 22)
- **Host Key Algorithm:** `ssh-ed25519`
- **Host Public Key Data (in `known_hosts`):**
  ```
  200.97.161.128 ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGHNEB/8JFEwU/RkzxUwa1ykxU/P/RRUekqP03tBiCmA
  ```
- **Security Rule:** Host key checking MUST NOT be disabled. The workstation has already trusted this exact ED25519 public key.

---

## 3. OWNER-CONTROLLED SSH ACCESS SETUP PROCEDURE (WINDOWS)

The project owner can configure authenticated SSH access safely in 4 straightforward steps without compromising security:

### Step 1: Generate a Dedicated ED25519 Key Pair on Windows

Open **PowerShell** on your local machine and run:

```powershell
# Generate a modern, high-security ED25519 key pair dedicated to MECT
ssh-keygen -t ed25519 -C "mect-owner@mect.org.in" -f "$HOME\.ssh\id_ed25519_mect"
```
*(Press Enter when prompted for passphrase, or enter a passphrase of your choice).*

### Step 2: Retrieve the Public Key String

```powershell
# Display ONLY the public key (ends in .pub) - NEVER share the private key!
Get-Content "$HOME\.ssh\id_ed25519_mect.pub"
```
*Output will resemble:* `ssh-ed25519 AAAAC3... mect-owner@mect.org.in`

### Step 3: Authorize the Key on Hostinger VPS

You have two simple options to add your public key to the server:

#### Option A: Via Hostinger VPS Control Panel (Recommended)
1. Log in to your **Hostinger hPanel** &rarr; Navigate to **VPS Management** (`srv2000528`).
2. Go to **SSH Keys** or **Security** section.
3. Click **Add SSH Key**, paste the public key string from Step 2, and save.

#### Option B: Via Hostinger Browser Web Terminal
1. In Hostinger hPanel, click **Browser Web Terminal** (or VNC Console) to open an emergency root shell.
2. Run:
   ```bash
   mkdir -p ~/.ssh && chmod 700 ~/.ssh
   echo "PASTE_YOUR_PUBLIC_KEY_STRING_HERE" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```

### Step 4: Test Authenticated SSH Connection Using Safe Read-Only Commands

From your local Windows PowerShell terminal:

```powershell
# Test connection with safe read-only system commands
ssh -i "$HOME\.ssh\id_ed25519_mect" -o KexAlgorithms=curve25519-sha256 root@200.97.161.128 "uptime; free -m; df -h"
```

---

## 4. OPTIONAL: CONFIGURE LOCAL SSH CONFIG FOR CONVENIENCE

To avoid typing the `-o KexAlgorithms` and `-i` flags every time, append the following block to `C:\Users\himan\.ssh\config` (create the file if it does not exist):

```ssh-config
Host mect-vps
    HostName 200.97.161.128
    User root
    Port 22
    IdentityFile ~/.ssh/id_ed25519_mect
    KexAlgorithms curve25519-sha256
    StrictHostKeyChecking yes
```

Once saved, connecting is as simple as:
```powershell
ssh mect-vps
```

---

## 5. SECURITY RULES & OPERATIONAL RESTRICTIONS

1. **Never Disable Host Key Checking:**
   - NEVER pass `-o StrictHostKeyChecking=no` or `-o UserKnownHostsFile=/dev/null`.
   - Any MITM warning must be treated as a critical security breach.
2. **Never Weaken Cryptographic Algorithms:**
   - Do NOT force deprecated ciphers (e.g., `arcfour`, `3des`, `blowfish`) or weak MACs.
   - Standard `curve25519-sha256` maintains top-tier modern cryptographic protection.
3. **Never Commit Private Keys:**
   - Ensure `$HOME\.ssh\` and any `.pem`/`.key` files are outside the Git repository tree.
   - Workspace `.gitignore` already ignores `*.pem`, `*.key`, and `.ssh/`.
4. **Least-Privilege Principle:**
   - If a dedicated non-root user (e.g., `mectadmin` in the `docker` group) is preferred, configure the key in that user's `~/.ssh/authorized_keys` instead of `root`.

---

## 6. READINESS VERDICT

```
+=============================================================================+
|             MECT PHASE 29.4.2C SSH ACCESS READINESS STATUS                  |
+=============================================================================+
| Host IP & Port:                       200.97.161.128:22 (Reachable)         |
| Host ED25519 Key:                     VERIFIED & STORED in known_hosts      |
| Windows OpenSSH KEX Fix:              curve25519-sha256 documented          |
| Local Private Key on Workstation:     ABSENT (Requires owner generation)    |
| Remote Public Key Authorization:      PENDING (Requires owner hPanel action)|
+=============================================================================+
| STATUS:                               READY FOR OWNER ACTIVATION            |
+=============================================================================+
```
