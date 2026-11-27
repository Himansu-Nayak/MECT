import paramiko

def check_prod_nginx():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect("200.97.161.128", username="root")

    stdin, stdout, stderr = client.exec_command('grep -n -C 5 "proxy_pass.*8081" /etc/nginx/sites-available/mect.org.in || true')
    print("PROD NGINX CONFIG:\n", stdout.read().decode())
    client.close()

if __name__ == "__main__":
    check_prod_nginx()
