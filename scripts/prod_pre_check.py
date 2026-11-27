import paramiko

def prod_pre_check():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect("200.97.161.128", username="root")

    commands = [
        ("cd /opt/mect && git status -s && git log -n 1 --oneline", "Check prod git status"),
        ("docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'", "Check running containers"),
        ("ls -lh /opt/mect/backups/", "Check existing production backups")
    ]

    for cmd, desc in commands:
        print(f"\n--- {desc} ---", flush=True)
        stdin, stdout, stderr = client.exec_command(cmd)
        out = stdout.read().decode()
        err = stderr.read().decode()
        if out: print(out.strip())
        if err: print(err.strip())

    client.close()

if __name__ == "__main__":
    prod_pre_check()
