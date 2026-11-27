import subprocess
import os
import json
import hashlib

def sh(cmd):
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return res.stdout.strip()

print("==================================================")
print("PHASE 2.9 - READ-ONLY SERVER AND INGRESS AUDIT")
print("==================================================")

# 1. Inspect sites-enabled and sites-available
print("\n--- 1. NGINX SITES INVENTORY ---")
print("sites-enabled:")
print(sh("ls -la /etc/nginx/sites-enabled/"))
print("\nsites-available:")
print(sh("ls -la /etc/nginx/sites-available/"))

# 2. Check if staging config is enabled
is_enabled = os.path.exists("/etc/nginx/sites-enabled/staging.mect.org.in.conf")
print(f"\nIs staging.mect.org.in.conf enabled in sites-enabled? {is_enabled}")

# 3. Check realip or http configuration in nginx.conf
print("\n--- 2. NGINX GLOBAL CONFIGURATION (realip check) ---")
print(sh("grep -rn 'real_ip' /etc/nginx/"))

# 4. Inspect TLS Certificate & Key Modulus
print("\n--- 3. TLS CERTIFICATE & KEY AUDIT ---")
cert_path = "/etc/ssl/mect/fullchain.pem"
key_path = "/etc/ssl/mect/origin.key"
if os.path.exists(cert_path) and os.path.exists(key_path):
    cert_mod = sh(f"openssl x509 -noout -modulus -in {cert_path} | openssl md5")
    key_mod = sh(f"openssl rsa -noout -modulus -in {key_path} | openssl md5")
    print(f"Certificate exists: {os.path.exists(cert_path)} (Modulus MD5: {cert_mod})")
    print(f"Key exists: {os.path.exists(key_path)} (Modulus MD5: {key_mod})")
    print(f"Keys Match: {cert_mod == key_mod}")
    print("Certificate Dates:\n" + sh(f"openssl x509 -in {cert_path} -noout -dates"))
    print("Certificate SANs:\n" + sh(f"openssl x509 -in {cert_path} -noout -text | grep -A 2 'Subject Alternative Name'"))
else:
    print(f"ERROR: Missing cert or key! cert={os.path.exists(cert_path)}, key={os.path.exists(key_path)}")

# 5. Staging Docker Containers & Ports
print("\n--- 4. RUNNING DOCKER CONTAINERS ---")
print(sh("docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}'"))

# 6. Current response for Host: staging.mect.org.in on port 80 & 443
print("\n--- 5. DIRECT LOCAL NGINX INGRESS PROBE ---")
print("HTTP Port 80 response:")
print(sh("curl -s -I -H 'Host: staging.mect.org.in' http://127.0.0.1/ | head -n 5"))
print("\nHTTPS Port 443 response:")
print(sh("curl -s -k -I -H 'Host: staging.mect.org.in' https://127.0.0.1/ | head -n 5"))
