import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('200.97.161.128', username='root')

stdin, stdout, stderr = client.exec_command('docker exec mect-postgres psql -U mect_user -d mect_db -c "SELECT id, username, email, role, status FROM admin_users;"')
print('PROD ADMIN_USERS:\n', stdout.read().decode())

stdin, stdout, stderr = client.exec_command('docker exec mect-postgres-staging psql -U mect_staging_user -d mect_staging_db -c "SELECT id, username, email, role, status FROM admin_users;"')
print('STAGING ADMIN_USERS:\n', stdout.read().decode())

client.close()
