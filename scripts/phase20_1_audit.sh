#!/usr/bin/env bash
set -euo pipefail

echo "=== 1. OHO TECH ISOLATION ==="
pm2 list
netstat -tulpn | grep -E '3000|8080|3001|8081|5432|5433' || true

echo "=== 2. PUBLIC ROUTE SMOKE TESTS ==="
for url in "https://mect.org.in/" "https://mect.org.in/about" "https://mect.org.in/programmes" "https://mect.org.in/donate" "https://mect.org.in/contact" "https://mect.org.in/portal" "https://mect.org.in/admin" "https://mect.org.in/transparency" "https://mect.org.in/volunteer" "https://mect.org.in/scholarship"; do
  code=$(curl -k -s -o /dev/null -w "%{http_code}" "$url")
  echo "$url -> $code"
done

echo "=== 3. BACKEND API ENDPOINTS ==="
for endpoint in "https://mect.org.in/api/v1/health" "https://mect.org.in/api/v1/public/donations/programmes" "https://mect.org.in/api/v1/public/cms/content/home" "https://mect.org.in/api/v1/admin/donations"; do
  code=$(curl -k -s -o /dev/null -w "%{http_code}" "$endpoint")
  echo "$endpoint -> $code"
done

echo "=== 4. WEBHOOK SIGNATURE INTEGRITY ==="
webhook_res=$(curl -k -s -w "\nHTTP_STATUS:%{http_code}" -X POST https://mect.org.in/api/v1/public/donations/cashfree-webhook \
  -H "Content-Type: application/json" \
  -H "x-webhook-signature: INVALID_FAKE_SIGNATURE" \
  -H "x-webhook-timestamp: 1731484800000" \
  -d '{"data":{"order":{"order_id":"MECT-DON-TEST","order_amount":100.00},"payment":{"payment_status":"SUCCESS"}}}')
echo "Invalid Webhook Response: $webhook_res"

echo "=== 5. SECURITY HEADERS ==="
curl -k -I https://mect.org.in/ | grep -E -i 'strict-transport-security|x-frame-options|x-content-type-options|x-xss-protection|content-security-policy|server' || true

echo "=== 6. RESOURCE CONSUMPTION ==="
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}\t{{.NetIO}}\t{{.BlockIO}}"

echo "=== 7. DOCKER HEALTH STATUS ==="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
