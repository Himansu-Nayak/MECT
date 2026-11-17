import re
with open("/opt/mect/frontend/.next/static/chunks/app/admin/login/page-123b64ec8213ba34.js") as f:
    c = f.read()
urls = re.findall(r'https?://[^\s\'"<>]+', c)
print("URLS IN CHUNK:", urls)
m = re.search(r'let a="([^"]+)"', c)
if m:
    print('let a =', m.group(1))
m2 = re.search(r'fetch\(`\$\{([^}]+)\}/auth/login', c)
if m2:
    print('fetch base var =', m2.group(1))

