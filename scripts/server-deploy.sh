#!/usr/bin/env bash
# Runs ON the server as the `vertis` user. Deploys one environment:
#
#   bash scripts/server-deploy.sh staging       origin/staging → staging.vertisglobal.com
#   bash scripts/server-deploy.sh production    origin/main    → vertisglobal.com
#
# Fetches the branch, hard resets the checkout to it, installs, builds,
# and zero-downtime reloads that environment's pm2 process, then fails
# unless the site answers 200. Called by scripts/deploy-dispatch.sh (the
# GitHub Actions path) and by the manual scripts on a developer machine.
#
# Versioned in the repo, so a deploy runs the version that was just
# pushed. `git reset --hard` replaces this file while bash is reading it;
# safe, because git writes a new inode and bash keeps the old one open.
set -euo pipefail

ENV="${1:-}"
case "$ENV" in
  staging)
    APP=/var/www/vertisglobal.com/staging/app
    BRANCH=staging
    PROCESS=vertis-staging
    URL=https://staging.vertisglobal.com/
    ;;
  production)
    APP=/var/www/vertisglobal.com/production/app
    BRANCH=main
    PROCESS=vertis-production
    URL=https://vertisglobal.com/
    ;;
  *)
    echo "usage: server-deploy.sh staging|production" >&2
    exit 2
    ;;
esac

REPO=https://github.com/marketing883/Vertis-global.git

# First deploy of an environment: the checkout does not exist yet.
if [ ! -d "$APP/.git" ]; then
  echo "→ first deploy: cloning $BRANCH into $APP"
  mkdir -p "$APP"
  git -C "$APP" init -q -b "$BRANCH"
  git -C "$APP" remote add origin "$REPO"
fi

cd "$APP"
echo "→ fetching origin/$BRANCH"
git fetch -q origin "$BRANCH"
git reset -q --hard "origin/$BRANCH"
echo "→ building $(git log --oneline -1)"
npm ci --no-audit --no-fund --silent
npm run build 2>&1 | tail -3
echo "→ reloading pm2 ($PROCESS)"
pm2 startOrReload ecosystem.config.cjs --only "$PROCESS" --update-env >/dev/null
pm2 save >/dev/null
sleep 2
code=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
echo "→ $URL $code"
[ "$code" = "200" ]
