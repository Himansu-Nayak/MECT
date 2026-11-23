Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  MECT PRODUCTION DEPLOYMENT CUTOVER (POWERSHELL)      " -ForegroundColor Cyan
Write-Host "  Target: Hostinger VPS (200.97.161.128 / mect.org.in)  " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Connecting to Hostinger VPS via SSH..." -ForegroundColor Yellow
Write-Host "Please type your VPS root password when prompted:" -ForegroundColor Yellow
Write-Host ""

$remoteCmd = @"
cd /opt/mect && \
mkdir -p backups && \
docker compose -f compose.production.yaml --env-file .env.production exec -T mect-postgres pg_dump -U mect_user -d mect_db > backups/mect_db_pre_deploy_`$(date +%Y%m%d_%H%M%S).sql && \
git fetch origin && \
git checkout main && \
git pull origin main && \
docker compose -f compose.production.yaml --env-file .env.production up -d --build && \
echo '' && \
echo '==============================================' && \
echo 'DEPLOYMENT COMPLETE - RUNNING CONTAINER STATUS:' && \
docker compose -f compose.production.yaml --env-file .env.production ps
"@

ssh -t root@200.97.161.128 $remoteCmd

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "Deployment command execution finished!" -ForegroundColor Green
Write-Host "Return to Antigravity and say 'check live' to verify." -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Read-Host -Prompt "Press Enter to exit"
