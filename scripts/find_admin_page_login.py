with open("/opt/mect/frontend/.next/server/app/admin/login/page.js") as f:
    c = f.read()
idx = c.find("/auth/login")
print("FOUND AT:", idx)
if idx != -1:
    print(c[idx-300:idx+150])

