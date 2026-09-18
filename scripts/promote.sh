#!/usr/bin/env bash
# Promote what is on staging to production.
#
#   npm run promote
#
# Fast-forwards `main` to `staging` and pushes. That push is what deploys:
# .github/workflows/deploy-production.yml builds origin/main on the server.
# If the `production` environment in GitHub has required reviewers, the
# run waits for their approval before touching the live site.
#
# Refuses to run if staging has anything main does not already contain in
# a fast-forwardable way, so history on main is never rewritten. The one
# exception is the very first promotion, when main still holds the old
# Eleventy site with unrelated history: pass --first-time to replace it
# (the old history is kept on a branch called `eleventy-site`).
set -euo pipefail
cd "$(dirname "$0")/.."

git fetch -q origin staging main
S=$(git rev-parse origin/staging)
M=$(git rev-parse origin/main)

if [ "$S" = "$M" ]; then
  echo "main already matches staging ($(git rev-parse --short "$S")). Nothing to promote."
  exit 0
fi

if [ "${1:-}" = "--first-time" ]; then
  echo "→ keeping the old site's history as branch eleventy-site"
  git push -q origin "origin/main:refs/heads/eleventy-site"
  echo "→ replacing main with staging ($(git rev-parse --short "$S"))"
  git push --force-with-lease=main:"$M" origin "origin/staging:main"
elif git merge-base --is-ancestor "$M" "$S"; then
  echo "→ fast-forwarding main to staging ($(git rev-parse --short "$M") → $(git rev-parse --short "$S"))"
  git push origin "origin/staging:main"
else
  echo "refused: main has commits that are not on staging. Merge main into staging first." >&2
  exit 1
fi
echo "pushed. The production deploy runs in GitHub Actions:"
echo "https://github.com/marketing883/Vertis-global/actions/workflows/deploy-production.yml"
