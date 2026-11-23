import subprocess
res = subprocess.check_output(["docker", "exec", "mect-frontend", "cat", "/app/.next/static/chunks/app/admin/login/page-17dd5cde2a805ce9.js"]).decode("utf-8")
idx = res.find("/public/volunteers")
print(res[idx-400:idx])

