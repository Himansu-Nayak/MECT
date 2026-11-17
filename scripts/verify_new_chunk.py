import subprocess
login_files = subprocess.check_output(["docker", "exec", "mect-frontend", "ls", "/app/.next/static/chunks/app/admin/login"]).decode().strip().split()
latest_file = [f for f in login_files if f.startswith("page-")][-1]
print("LATEST CHUNK:", latest_file)
chunk = subprocess.check_output(["docker", "exec", "mect-frontend", "cat", f"/app/.next/static/chunks/app/admin/login/{latest_file}"]).decode()
idx = chunk.find("/auth/login")
print("SNIPPET:", chunk[idx-120:idx+60])
idx2 = chunk.find("https://mect.org.in")
print("SNIPPET BASE:", chunk[idx2-20:idx2+60])

