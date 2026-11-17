import os, sys, urllib.request, json
user = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("MECT_TEST_USER", "test_user")
pwd = sys.argv[2] if len(sys.argv) > 2 else os.environ.get("MECT_TEST_PWD", "test_password")
payload = json.dumps({"username": user, "password": pwd}).encode("utf-8")
req = urllib.request.Request("http://127.0.0.1:8081/api/v1/auth/login", data=payload, headers={"Content-Type": "application/json"})
try:
    with urllib.request.urlopen(req) as resp:
        print("SUCCESS:", resp.status)
except urllib.error.HTTPError as e:
    print("FAILED:", e.code)

