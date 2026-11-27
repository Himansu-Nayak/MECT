import paramiko

def check():
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect('200.97.161.128', username='root')
    stdin, stdout, stderr = c.exec_command('docker exec mect-postgres psql -U mect_user -d mect_db -c "SELECT column_name FROM information_schema.columns WHERE table_name = \'manual_bank_transfer_claims\';"')
    print("COLUMNS:\n", stdout.read().decode())
    stdin, stdout, stderr = c.exec_command('docker exec mect-postgres psql -U mect_user -d mect_db -c "SELECT * FROM manual_bank_transfer_claims ORDER BY id DESC LIMIT 1;"')
    print("LATEST ROW:\n", stdout.read().decode())
    c.close()

if __name__ == "__main__":
    check()
