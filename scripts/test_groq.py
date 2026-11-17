import urllib.request, json, os
api_key = os.environ.get("GROQ_API_KEY", "")
req = urllib.request.Request(
    "https://api.groq.com/openai/v1/chat/completions",
    data=json.dumps({"model": "qwen/qwen3.8-27b", "messages": [{"role": "user", "content": "Hi"}]}).encode(),
    headers={
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
)
try:
    with urllib.request.urlopen(req) as resp:
        print("SUCCESS:", resp.read().decode()[:200])
except urllib.error.HTTPError as e:
    print("FAILED:", e.code, e.read().decode())

