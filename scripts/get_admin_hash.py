import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('200.97.161.128', username='root')

stdin, stdout, stderr = client.exec_command('docker exec mect-postgres psql -U mect_user -d mect_db -t -c "SELECT password_hash FROM admin_users WHERE id=1;"')
print('PROD ADMIN HASH:', stdout.read().decode().strip())

client.close()
