with open("/opt/mect/frontend/.next/static/chunks/app/admin/login/page-123b64ec8213ba34.js") as f:
    c = f.read()
idx = c.find("/auth/login")
print(c[idx-1200:idx-400])

