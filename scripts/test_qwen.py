import urllib.request, json, os
api_key = os.environ.get("GROQ_API_KEY", "")
req = urllib.request.Request(
    "https://api.groq.com/openai/v1/chat/completions",
    data=json.dumps({"model": "qwen/qwen3.8-27b", "messages": [{"role": "user", "content": "Hi"}]}).encode(),
    headers={
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "User-Agent": "Groq/NodeJS/0.9.0"
    }
)
try:
    with urllib.request.urlopen(req) as resp:
        print("SUCCESS:", resp.read().decode()[:300])
except urllib.error.HTTPError as e:
    print("FAILED:", e.code, e.read().decode())

