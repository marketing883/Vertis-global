#!/usr/bin/env bash
# Manual deploy of origin/staging. Normally unnecessary: every push to
# `staging` deploys itself via .github/workflows/deploy-staging.yml.
# Fallback for when Actions is down. Needs root SSH (`vertis-staging`).
#   npm run deploy:staging
set -euo pipefail
cd "$(dirname "$0")/.."
git fetch -q origin staging
[ -n "$(git status --porcelain)" ] && echo "note: uncommitted changes will NOT be deployed."
[ "$(git rev-parse HEAD)" != "$(git rev-parse origin/staging)" ] && echo "note: deploying origin/staging ($(git rev-parse --short origin/staging)), not local HEAD."
ssh vertis-staging "su - vertis -c 'bash /var/www/vertisglobal.com/staging/app/scripts/server-deploy.sh staging'"
