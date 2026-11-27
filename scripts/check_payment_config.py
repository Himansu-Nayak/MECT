import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('200.97.161.128', username='root')

stdin, stdout, stderr = client.exec_command('docker exec mect-postgres-staging psql -U mect_staging_user -d mect_staging_db -c "SELECT * FROM payment_configurations;"')
print('STAGING PAYMENT_CONFIG:\n', stdout.read().decode())

stdin, stdout, stderr = client.exec_command('docker exec mect-postgres psql -U mect_user -d mect_db -c "SELECT * FROM payment_configurations;"')
print('PROD PAYMENT_CONFIG:\n', stdout.read().decode())

client.close()
