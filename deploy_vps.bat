@echo off
echo ========================================================
echo   MECT PRODUCTION DEPLOYMENT CUTOVER (ONE-CLICK)
echo   Target: Hostinger VPS (200.97.161.128 / mect.org.in)
echo ========================================================
echo.
echo Connecting to VPS via SSH...
echo Please enter your VPS root password when prompted:
echo.

ssh -t root@200.97.161.128 "cd /opt/mect && mkdir -p backups && docker compose -f compose.production.yaml --env-file .env.production exec -T mect-postgres pg_dump -U mect_user -d mect_db > backups/mect_db_pre_deploy_$(date +%%Y%%m%%d_%%H%%M%%S).sql && git fetch origin && git checkout main && git pull origin main && docker compose -f compose.production.yaml --env-file .env.production up -d --build && echo '' && echo '==============================================' && echo 'DEPLOYMENT COMPLETE - RUNNING CONTAINER STATUS:' && docker compose -f compose.production.yaml --env-file .env.production ps"

echo.
echo ========================================================
echo Deployment command execution finished!
echo Return to Antigravity and say 'check live' to verify.
echo ========================================================
pause
