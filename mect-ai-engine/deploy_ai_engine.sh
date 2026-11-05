#!/usr/bin/env bash
# ==============================================================================
# MAHAVIR TRUST (MECT) — Autonomous AI Engine VPS Deployment Script
# Target Host: Hostinger KVM 4 VPS (200.97.161.128) - Ubuntu 26.04.1 LTS
# ==============================================================================

set -euo pipefail

echo "=================================================================="
echo "Starting MECT HIm AI Engine Deployment on Hostinger VPS"
echo "=================================================================="

INSTALL_DIR="/opt/mect-ai-engine"
SERVICE_NAME="mect-ai-engine"

# 1. Ensure target directory exists
echo "[1/6] Creating deployment directory at ${INSTALL_DIR}..."
sudo mkdir -p "${INSTALL_DIR}/models"
sudo mkdir -p "${INSTALL_DIR}/logs"

# 2. Synchronize engine files
echo "[2/6] Copying engine files..."
sudo cp -r app "${INSTALL_DIR}/"
sudo cp requirements.txt "${INSTALL_DIR}/"
sudo cp mect_knowledge_chunks.json "${INSTALL_DIR}/"

# 3. Create Python Virtual Environment
echo "[3/6] Setting up isolated Python 3 virtual environment..."
if [ ! -d "${INSTALL_DIR}/venv" ]; then
    sudo python3 -m venv "${INSTALL_DIR}/venv"
fi

sudo "${INSTALL_DIR}/venv/bin/pip" install --upgrade pip
sudo "${INSTALL_DIR}/venv/bin/pip" install -r "${INSTALL_DIR}/requirements.txt"

# 4. Deploy Systemd Service
echo "[4/6] Installing systemd service unit with 3.8GB memory limits..."
sudo cp systemd/mect-ai-engine.service /etc/systemd/system/
sudo systemctl daemon-reload

# 5. Check if GGUF model is present
echo "[5/6] Checking model weights..."
if [ -f "${INSTALL_DIR}/models/qwen2.5-3b-mect-q4_k_m.gguf" ]; then
    echo "Found primary GGUF model: qwen2.5-3b-mect-q4_k_m.gguf"
else
    echo "Notice: Primary model not yet present in ${INSTALL_DIR}/models/."
    echo "Upload qwen2.5-3b-mect-q4_k_m.gguf from Colab to ${INSTALL_DIR}/models/."
fi

# 6. Enable and Start Service
echo "[6/6] Starting ${SERVICE_NAME}.service..."
sudo systemctl enable "${SERVICE_NAME}"
sudo systemctl restart "${SERVICE_NAME}"

sleep 2
sudo systemctl status "${SERVICE_NAME}" --no-pager

echo "=================================================================="
echo "Deployment Complete! Service active on 127.0.0.1:8082"
echo "Health probe: curl http://127.0.0.1:8082/v1/health"
echo "=================================================================="

