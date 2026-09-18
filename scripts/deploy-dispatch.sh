#!/usr/bin/env bash
# The ONLY thing the GitHub Actions SSH key is allowed to run. It is wired
# as a forced command in ~vertis/.ssh/authorized_keys, so whatever the
# client asks for arrives here as $SSH_ORIGINAL_COMMAND and is checked
# against a whitelist. Anything else is refused. No shell, no root.
set -euo pipefail

STAGING_SCRIPT=/var/www/vertisglobal.com/staging/app/scripts/server-deploy.sh

case "${SSH_ORIGINAL_COMMAND:-}" in
  deploy-staging)    exec bash "$STAGING_SCRIPT" staging ;;
  deploy-production) exec bash "$STAGING_SCRIPT" production ;;
  *)
    echo "refused: '${SSH_ORIGINAL_COMMAND:-}' is not a deploy command" >&2
    exit 1
    ;;
esac
