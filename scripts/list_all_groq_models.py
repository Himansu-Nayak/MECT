import urllib.request, json, os
api_key = os.environ.get("GROQ_API_KEY", "")
req = urllib.request.Request(
    "https://api.groq.com/openai/v1/models",
    headers={
        "Authorization": f"Bearer {api_key}",
        "User-Agent": "Mozilla/5.0"
    }
)
try:
    with urllib.request.urlopen(req) as resp:
        models = json.loads(resp.read().decode())
        ids = [m["id"] for m in models.get("data", [])]
        print("ALL AVAILABLE GROQ MODELS:", ids)
except urllib.error.HTTPError as e:
    print("FAILED:", e.code, e.read().decode())

