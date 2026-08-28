#!/usr/bin/env bash
# Deploy latest main on the droplet. Run as: bash /var/www/ueforged/deploy.sh
set -euo pipefail
cd /var/www/ueforged
git pull origin main
pnpm install --frozen-lockfile
pnpm run build
pm2 restart ue-forged
echo "Deployed $(git log --oneline -1)"
