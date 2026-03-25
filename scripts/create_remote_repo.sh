#!/usr/bin/env bash
# Helper: create a GitHub repo and push the current project.
# Requires: GitHub CLI (`gh`) installed and authenticated (gh auth login)

set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI not found. Install from https://cli.github.com/ and run 'gh auth login'"
  exit 1
fi

NAME=${1:-booking-assessment}
VISIBILITY=${2:-public}

echo "Creating GitHub repo: $NAME ($VISIBILITY)"
gh repo create "$NAME" --$VISIBILITY --source=. --remote=origin --push

echo "Remote created and pushed. Repo URL:"
gh repo view --json url -q .url

echo "Done. You can now visit the repo or connect deployment (Vercel / Netlify)."
