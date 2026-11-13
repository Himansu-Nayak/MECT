#!/usr/bin/env bash
set -euo pipefail

echo "=== 1. PUBLIC APIS SENSITIVE DATA SCAN ==="
res_prog=$(curl -s https://mect.org.in/api/v1/public/donations/programmes)
if echo "$res_prog" | grep -iqE 'password|secret|jwt|pan|phone|postgres'; then
  echo "WARNING: Sensitive keyword in programmes"
else
  echo "PASS: Public programmes endpoint is clean."
fi

res_health=$(curl -s https://mect.org.in/api/v1/health)
if echo "$res_health" | grep -iqE 'password|secret|jdbc|postgres|token'; then
  echo "WARNING: Sensitive keyword in health"
else
  echo "PASS: Public health endpoint is clean."
fi

echo "=== 2. WEB PAGE HTML LEAK SCAN ==="
res_home=$(curl -s https://mect.org.in/)
if echo "$res_home" | grep -iqE 'JWT_SECRET|CASHFREE_CLIENT_SECRET|POSTGRES_PASSWORD|MectSecure'; then
  echo "CRITICAL: Secret leaked in homepage HTML!"
else
  echo "PASS: Homepage HTML contains zero secret environment variables."
fi

echo "=== 3. HIDDEN CONFIGURATION FILES EXPOSURE ==="
echo -n "https://mect.org.in/.env -> "
curl -s -o /dev/null -w "%{http_code}\n" https://mect.org.in/.env

echo -n "https://mect.org.in/.env.production -> "
curl -s -o /dev/null -w "%{http_code}\n" https://mect.org.in/.env.production

echo -n "https://mect.org.in/.git/config -> "
curl -s -o /dev/null -w "%{http_code}\n" https://mect.org.in/.git/config

echo -n "https://mect.org.in/compose.production.yaml -> "
curl -s -o /dev/null -w "%{http_code}\n" https://mect.org.in/compose.production.yaml

echo "=== 4. SOURCE MAPS EXPOSURE SCAN ==="
# Check if any .map files are publicly exposed in Next.js static assets
sample_js=$(echo "$res_home" | grep -oE '/_next/static/chunks/[^"]+\.js' | head -n 1)
if [ -n "$sample_js" ]; then
  map_url="https://mect.org.in${sample_js}.map"
  echo -n "$map_url -> "
  curl -s -o /dev/null -w "%{http_code}\n" "$map_url"
fi
