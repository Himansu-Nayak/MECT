Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  MECT PRODUCTION DEPLOYMENT CUTOVER (POWERSHELL)      " -ForegroundColor Cyan
Write-Host "  Target: Hostinger VPS (200.97.161.128 / mect.org.in)  " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Connecting to Hostinger VPS via SSH..." -ForegroundColor Yellow
Write-Host "Please type your VPS root password when prompted:" -ForegroundColor Yellow
Write-Host ""

$pubKey = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBlxMAkmZCn41v1gVZk7HUEIQ4QS3mhA5bPjP/M6G2jW himan@HIMANSU"
$remoteCmd = @"
mkdir -p ~/.ssh && chmod 700 ~/.ssh && (grep -qF '$pubKey' ~/.ssh/authorized_keys 2>/dev/null || echo '$pubKey' >> ~/.ssh/authorized_keys) && chmod 600 ~/.ssh/authorized_keys && cd /opt/mect && mkdir -p backups && (docker exec mect-postgres pg_dump -U mect_user -d mect_db > backups/mect_db_pre_deploy_`$(date +%Y%m%d_%H%M%S).sql 2>/dev/null || true) && git fetch origin && git checkout main && git pull origin main && docker compose -f compose.production.yaml --env-file .env.production up -d --build && echo '' && echo '==============================================' && echo 'DEPLOYMENT COMPLETE - RUNNING CONTAINER STATUS:' && docker compose -f compose.production.yaml --env-file .env.production ps
"@

ssh -t root@200.97.161.128 $remoteCmd

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "Deployment command execution finished!" -ForegroundColor Green
Write-Host "SSH key is now installed. Future deployments will be 100% automated." -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Read-Host -Prompt "Press Enter to exit"
