#!/usr/bin/env bash
# Deploys the working tree to staging.vertisglobal.com.
#
#   bash scripts/deploy-staging.sh
#
# Needs the `vertis-staging` host in ~/.ssh/config (root@160.153.176.140
# with the deploy key). Packs the tree without node_modules, .next, .git,
# env files and the dev-only hero clip options, ships it, then installs,
# builds and zero-downtime reloads the pm2 process as the `vertis` user.
# The build happens on the server so the binary artefacts match its Node.
set -euo pipefail

HOST=vertis-staging
APP=/var/www/vertisglobal.com/staging/app
PKG=/tmp/vertis-staging.tgz

cd "$(dirname "$0")/.."
echo "→ packing"
tar --exclude=./node_modules --exclude=./.next --exclude=./.git \
    --exclude=./public/hero-video/options --exclude='./.env*' --exclude=./.claude \
    -czf "$PKG" .
echo "→ uploading $(du -h "$PKG" | cut -f1)"
scp -q "$PKG" "$HOST:$PKG"
echo "→ installing and building on the server"
ssh "$HOST" bash -s <<REMOTE
set -e
mkdir -p $APP
tar -xzf $PKG -C $APP
rm -f $PKG
chown -R vertis:vertis $APP
su - vertis -c "cd $APP && npm ci --no-audit --no-fund --silent && npm run build 2>&1 | tail -3 && pm2 reload ecosystem.config.cjs --update-env >/dev/null && pm2 save >/dev/null"
sleep 2
curl -s -o /dev/null -w "→ https://staging.vertisglobal.com/ %{http_code}\n" https://staging.vertisglobal.com/
REMOTE
rm -f "$PKG"
echo "done"
