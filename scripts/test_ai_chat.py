import urllib.request, json

payload = {
    "messages": [
        {"role": "user", "content": "How can I volunteer or mentor students in Odisha?"}
    ],
    "preferredLanguage": "en"
}
data = json.dumps(payload).encode("utf-8")

req = urllib.request.Request(
    "http://127.0.0.1:3001/api/ai/chat",
    data=data,
    headers={
        "Content-Type": "application/json",
        "User-Agent": "TestClient/1.0"
    }
)

try:
    with urllib.request.urlopen(req) as resp:
        print("STATUS:", resp.status)
        for line in resp:
            print("STREAM:", line.decode("utf-8", errors="ignore").strip())
except urllib.error.HTTPError as e:
    print("FAILED:", e.code, e.read().decode())

