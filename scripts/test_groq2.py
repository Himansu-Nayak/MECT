import urllib.request, json, os
api_key = os.environ.get("GROQ_API_KEY", "")
req = urllib.request.Request(
    "https://api.groq.com/openai/v1/chat/completions",
    data=json.dumps({"model": "qwen-2.5-32b", "messages": [{"role": "user", "content": "Hi"}]}).encode(),
    headers={
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
)
try:
    with urllib.request.urlopen(req) as resp:
        print("SUCCESS:", resp.read().decode()[:200])
except urllib.error.HTTPError as e:
    print("FAILED:", e.code, e.read().decode())

