@echo off
title MECT Production Deployment Cutover
echo ========================================================
echo   MECT PRODUCTION DEPLOYMENT CUTOVER (ONE-CLICK)
echo   Target: Hostinger VPS (200.97.161.128 / mect.org.in)
echo ========================================================
echo.
echo Connecting to VPS via SSH...
echo Please enter your VPS root password when prompted:
echo.

ssh -t root@200.97.161.128 "mkdir -p ~/.ssh && chmod 700 ~/.ssh && (grep -qF 'AAAAC3NzaC1lZDI1NTE5AAAAIBlxMAkmZCn41v1gVZk7HUEIQ4QS3mhA5bPjP/M6G2jW' ~/.ssh/authorized_keys 2>/dev/null || echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBlxMAkmZCn41v1gVZk7HUEIQ4QS3mhA5bPjP/M6G2jW himan@HIMANSU' >> ~/.ssh/authorized_keys) && chmod 600 ~/.ssh/authorized_keys && cd /opt/mect && mkdir -p backups && (docker exec mect-postgres pg_dump -U mect_user -d mect_db > backups/mect_db_pre_deploy_$(date +%%Y%%m%%d_%%H%%M%%S).sql 2>/dev/null || true) && git fetch origin && git checkout main && git pull origin main && docker compose -f compose.production.yaml --env-file .env.production up -d --build && echo '' && echo '==============================================' && echo 'DEPLOYMENT COMPLETE - RUNNING CONTAINER STATUS:' && docker compose -f compose.production.yaml --env-file .env.production ps"

echo.
echo ========================================================
echo Deployment command execution finished!
echo SSH key is now installed. Future deployments will be 100%% automated.
echo You may close this window.
echo ========================================================
pause
