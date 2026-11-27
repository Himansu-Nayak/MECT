import urllib.request
import ssl
import json

ctx = ssl.create_default_context()

print('=== 1. Probing Public Frontend over Cloudflare ===')
req_fe = urllib.request.Request('https://staging.mect.org.in/', headers={'User-Agent': 'Mozilla/5.0 MECT-QA'})
try:
    with urllib.request.urlopen(req_fe, context=ctx, timeout=15) as res:
        print(f'Frontend Status: {res.status}')
        print(f'Server Header: {res.headers.get("Server")}')
        print(f'Content-Type: {res.headers.get("Content-Type")}')
        body = res.read(500).decode('utf-8', errors='ignore')
        print(f'Body snippet: {body[:200]}...')
except Exception as e:
    print(f'Frontend failed: {e}')

print('\n=== 2. Probing Public Same-Origin Backend over Cloudflare ===')
req_api = urllib.request.Request('https://staging.mect.org.in/api/v1/actuator/health', headers={'User-Agent': 'Mozilla/5.0 MECT-QA'})
try:
    with urllib.request.urlopen(req_api, context=ctx, timeout=15) as res:
        print(f'API Status: {res.status}')
        print(f'Content-Type: {res.headers.get("Content-Type")}')
        print(f'Health payload: {res.read().decode("utf-8")}')
except Exception as e:
    print(f'API failed: {e}')

print('\n=== 3. Probing Dedicated API Hostname over Cloudflare ===')
req_dapi = urllib.request.Request('https://staging-api.mect.org.in/api/v1/actuator/health', headers={'User-Agent': 'Mozilla/5.0 MECT-QA'})
try:
    with urllib.request.urlopen(req_dapi, context=ctx, timeout=15) as res:
        print(f'Dedicated API Status: {res.status}')
        print(f'Health payload: {res.read().decode("utf-8")}')
except Exception as e:
    print(f'Dedicated API failed: {e}')

print('\n=== 4. Probing Direct Origin IP Rejection (Origin Protection Verification) ===')
ctx_noverify = ssl._create_unverified_context()
req_direct = urllib.request.Request('https://200.97.161.128:443/', headers={'Host': 'staging.mect.org.in', 'User-Agent': 'Mozilla/5.0 DirectOriginScraper'})
try:
    with urllib.request.urlopen(req_direct, context=ctx_noverify, timeout=10) as res:
        print(f'UNEXPECTED SUCCESS: Status: {res.status}')
except urllib.error.HTTPError as he:
    print(f'EXPECTED ORIGIN PROTECTION: Direct IP access returned HTTP {he.code} {he.reason}')
except Exception as e:
    print(f'Direct IP connection error (as expected or blocked): {e}')
