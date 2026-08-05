#!/usr/bin/env bash
# Build locally, ship to the VPS.
#
#   ./deploy/deploy.sh                      # uses the defaults below
#   VPS_HOST=root@1.2.3.4 ./deploy/deploy.sh
#
# The static half goes out with rsync (atomic enough — rsync writes to temp
# names and renames). The contact service is only restarted when its own
# sources changed, so a content-only deploy never drops an in-flight submit.

set -euo pipefail

VPS_HOST="${VPS_HOST:-deploy@vertisglobal.com}"
WEB_ROOT="${WEB_ROOT:-/var/www/vertisglobal}"
APP_ROOT="${APP_ROOT:-/opt/vertis-contact}"
SERVICE="${SERVICE:-vertis-contact}"

cd "$(dirname "$0")/.."

echo "==> Building"
npm ci
npm run build

# Fail loudly rather than rsyncing a half-built directory over production.
for required in _site/index.html _site/assets/css/main.css _site/404.html; do
  [ -f "$required" ] || { echo "FATAL: build incomplete, missing $required" >&2; exit 1; }
done
ls _site/assets/fonts/*.woff2 >/dev/null 2>&1 \
  || { echo "FATAL: fonts missing — did copy:fonts run?" >&2; exit 1; }

echo "==> Syncing site to ${VPS_HOST}:${WEB_ROOT}"
rsync -az --delete --human-readable \
  --exclude '.DS_Store' \
  _site/ "${VPS_HOST}:${WEB_ROOT}/"

echo "==> Syncing contact service to ${VPS_HOST}:${APP_ROOT}"
rsync -az --delete --human-readable \
  server package.json package-lock.json \
  "${VPS_HOST}:${APP_ROOT}/"

echo "==> Installing production deps and restarting ${SERVICE}"
ssh "${VPS_HOST}" bash -euo pipefail <<REMOTE
  cd "${APP_ROOT}"
  npm ci --omit=dev
  sudo systemctl restart "${SERVICE}"
  sleep 1
  systemctl is-active --quiet "${SERVICE}" || { journalctl -u "${SERVICE}" -n 30 --no-pager; exit 1; }
  curl -fsS http://127.0.0.1:\${PORT:-8787}/api/health
REMOTE

echo
echo "==> Deployed."
