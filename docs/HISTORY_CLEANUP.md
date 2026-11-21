# MECT GIT REPOSITORY HISTORY CLEANUP RUNBOOK

**Document Classification:** Confidential — Security Operations  
**Target Concern:** Historical credential leakage in git commit history (e.g., fallback Groq key in commit `e995fbb` scrubbed in `305c80a`).  
**Owner Action Required:** The repository owner must decide whether to rewrite remote git history using `git-filter-repo`.

> [!WARNING]
> Rewriting git history modifies all downstream commit SHAs across all branches. All collaborators and deployment targets must re-clone or rebase their branches after execution. Ensure the key is FIRST revoked in the Groq console regardless of whether history is rewritten.

---

## 1. Primary Remediation (Immediate & Mandatory)
1. Log in to the [Groq Console](https://console.groq.com/keys).
2. **REVOKE** the compromised API key that appeared in historical commit `e995fbb`.
3. Generate a new API key and store it exclusively in the VPS environment (`/opt/mect/.env.production`) and local git-ignored `.env.local`.

---

## 2. Git History Scrubbing Procedure (Owner Optional)

### Step 1: Install `git-filter-repo`
```bash
pip install git-filter-repo
```

### Step 2: Create a Complete Offline Backup Clone
```bash
git clone --mirror https://github.com/Himansu-Nayak/MAHAVIR-TRUST.git mahavir-trust-backup.git
```

### Step 3: Define Replacement Expression
Create a replacements file `expressions.txt`:
```text
regex:gsk_[a-zA-Z0-9]{40,}==>[REDACTED_GROQ_KEY]
```

### Step 4: Execute History Scrubbing
In a fresh local clone of the repository:
```bash
git filter-repo --replace-text expressions.txt
```

### Step 5: Verify Eradication
```bash
# Verify zero occurrences remain in git log
git log -G"gsk_" --oneline
```

### Step 6: Coordinated Force Push
Only execute after team alignment:
```bash
git push origin --force --all
git push origin --force --tags
```
