#!/usr/bin/env bash
# Deploys origin/staging to https://staging.vertisglobal.com
#
#   git push origin staging      # first, if you have not already
#   npm run deploy:staging
#
# The server is a git checkout of the `staging` branch at
# /var/www/vertisglobal.com/staging/app. This script tells it to fetch,
# hard reset to origin/staging, install, build and zero-downtime reload
# the pm2 process, all as the `vertis` user. Nothing is uploaded from
# this machine: what is on GitHub is what gets built.
#
# Needs the `vertis-staging` host in ~/.ssh/config (root@160.153.176.140
# with an authorised key).
set -euo pipefail

HOST=vertis-staging
APP=/var/www/vertisglobal.com/staging/app
BRANCH=staging

cd "$(dirname "$0")/.."

# Say so if what is about to deploy is not what is in the working tree.
if [ -n "$(git status --porcelain)" ]; then
  echo "note: you have uncommitted changes; they will NOT be deployed."
fi
git fetch -q origin "$BRANCH"
if [ "$(git rev-parse HEAD)" != "$(git rev-parse "origin/$BRANCH")" ]; then
  echo "note: local HEAD is not origin/$BRANCH. Deploying origin/$BRANCH ($(git rev-parse --short "origin/$BRANCH"))."
fi

ssh "$HOST" bash -s <<REMOTE
set -e
su - vertis -c '
  set -e
  cd $APP
  git fetch -q origin $BRANCH
  git reset -q --hard origin/$BRANCH
  echo "→ building \$(git log --oneline -1)"
  npm ci --no-audit --no-fund --silent
  npm run build 2>&1 | tail -3
  pm2 reload ecosystem.config.cjs --update-env >/dev/null
  pm2 save >/dev/null
'
sleep 2
curl -s -o /dev/null -w "→ https://staging.vertisglobal.com/ %{http_code}\n" https://staging.vertisglobal.com/
REMOTE
echo "done"
