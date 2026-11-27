import paramiko

def verify_db():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect("200.97.161.128", username="root")

    queries = [
        "SELECT donation_reference, donor_name, amount, status FROM donations ORDER BY id DESC LIMIT 2;",
        "SELECT claim_reference, utr_number, claimed_amount, status, reviewed_by FROM manual_bank_transfer_claims ORDER BY id DESC LIMIT 2;",
        "SELECT receipt_number, donor_display_name, amount FROM donation_receipts ORDER BY id DESC LIMIT 2;"
    ]

    for q in queries:
        print(f"\n--- {q} ---")
        stdin, stdout, stderr = client.exec_command(f'docker exec mect-postgres-staging psql -U mect_staging_user -d mect_staging_db -c "{q}"')
        out = stdout.read().decode()
        err = stderr.read().decode()
        if out: print("[OUT]", out)
        if err: print("[ERR]", err)
    client.close()

if __name__ == "__main__":
    verify_db()
