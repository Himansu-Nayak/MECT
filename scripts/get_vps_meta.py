import paramiko
import json

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("200.97.161.128", username="root", timeout=30)

commands = {
    "git_commit": "cd /opt/mect-staging && git rev-parse HEAD",
    "git_status": "cd /opt/mect-staging && git status -s",
    "docker_ps": "docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'",
    "backup_file": "ls -lh /opt/mect/backups/",
    "nginx_status": "systemctl is-active nginx",
    "db_version": "docker exec mect-postgres psql -U mect_user -d mect_db -t -c 'SELECT version();'",
    "flyway_schema": "docker exec mect-postgres psql -U mect_user -d mect_db -t -c 'SELECT version, description, success, installed_on FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 5;'"
}

meta = {}
for k, cmd in commands.items():
    _, stdout, stderr = ssh.exec_command(cmd)
    meta[k] = stdout.read().decode().strip()

print(json.dumps(meta, indent=2))
with open("docs/audits/vps_deployment_meta.json", "w") as f:
    json.dump(meta, f, indent=2)

ssh.close()
