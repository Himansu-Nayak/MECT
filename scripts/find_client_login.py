with open("/opt/mect/frontend/.next/static/chunks/app/admin/login/page-123b64ec8213ba34.js") as f:
    c = f.read()
idx = c.find("/auth/login")
print("FOUND AT:", idx)
if idx != -1:
    print(c[idx-300:idx+150])

