with open("/opt/mect/frontend/.next/static/chunks/app/admin/login/page-123b64ec8213ba34.js") as f:
    c = f.read()
idx = c.find("/public/inquiries")
print(c[idx-200:idx+50])

