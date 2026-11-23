import urllib.request, json

payload = {
    "messages": [
        {"role": "user", "content": "How can I volunteer or mentor students in Odisha?"}
    ],
    "preferredLanguage": "en"
}
data = json.dumps(payload).encode("utf-8")

req = urllib.request.Request(
    "https://mect.org.in/api/ai/chat",
    data=data,
    headers={
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
    }
)

try:
    with urllib.request.urlopen(req) as resp:
        print("STATUS:", resp.status)
        accumulated = []
        for line in resp:
            text = line.decode("utf-8", errors="ignore").strip()
            if text.startswith("data: ") and text != "data: [DONE]":
                try:
                    obj = json.loads(text[6:])
                    if "text" in obj:
                        accumulated.append(obj["text"])
                except:
                    pass
        print("ANSWER:\n" + "".join(accumulated))
except urllib.error.HTTPError as e:
    print("FAILED:", e.code, e.read().decode())

