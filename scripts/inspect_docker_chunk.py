import subprocess
res = subprocess.check_output(["docker", "exec", "mect-frontend", "cat", "/app/.next/static/chunks/app/admin/login/page-17dd5cde2a805ce9.js"]).decode("utf-8")
idx = res.find("/auth/login")
print("FOUND AT:", idx)
if idx != -1:
    print(res[idx-120:idx+80])

