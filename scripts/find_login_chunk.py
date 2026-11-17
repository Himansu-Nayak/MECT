with open("/opt/mect/frontend/.next/static/chunks/8336-497d5265e39bee6d.js") as f:
    c = f.read()
idx = c.find("/auth/login")
print("FOUND AT:", idx)
if idx != -1:
    print(c[idx-80:idx+120])

