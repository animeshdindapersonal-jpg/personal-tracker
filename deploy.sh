#!/usr/bin/env bash
#
# One-shot deploy: creates the GitHub repo, pushes the code, and enables
# GitHub Pages (GitHub Actions source). The included workflow then builds
# and publishes automatically.
#
# USAGE (run in YOUR terminal, not pasted into any chat):
#
#   export GH_USER="your-github-username"
#   export GH_TOKEN="ghp_xxx"        # a PAT with 'repo' + 'workflow' scope
#   bash deploy.sh
#
# The token is read from the environment so it never gets hard-coded or
# committed. Revoke the token afterwards if it was temporary.

set -euo pipefail

REPO_NAME="${REPO_NAME:-personal-tracker}"

: "${GH_USER:?Set GH_USER to your GitHub username}"
: "${GH_TOKEN:?Set GH_TOKEN to a Personal Access Token (repo + workflow scope)}"

echo "==> Target: github.com/${GH_USER}/${REPO_NAME}"

# 1) Create the repo via the GitHub API (idempotent: ignore 'already exists').
echo "==> Creating repo (if it doesn't exist)..."
http_code=$(curl -sS -o /tmp/gh_create.json -w "%{http_code}" \
  -X POST https://api.github.com/user/repos \
  -H "Authorization: Bearer ${GH_TOKEN}" \
  -H "Accept: application/vnd.github+json" \
  -d "{\"name\":\"${REPO_NAME}\",\"private\":false,\"description\":\"Personal tracker built with Astryx\"}")

if [ "$http_code" = "201" ]; then
  echo "    Repo created."
elif [ "$http_code" = "422" ]; then
  echo "    Repo already exists — continuing."
else
  echo "    GitHub API returned HTTP ${http_code}:"
  cat /tmp/gh_create.json
  exit 1
fi

# 2) Make sure vite.config base matches the repo name.
if [ "$REPO_NAME" != "personal-tracker" ]; then
  echo "==> NOTE: repo name is '${REPO_NAME}'. Update 'const repoName' in"
  echo "    vite.config.ts to '${REPO_NAME}' so assets load on Pages."
fi

# 3) Init git and push (token used only in the remote URL for this push).
echo "==> Pushing code..."
git init -b main >/dev/null 2>&1 || true
git add .
git commit -m "Personal tracker built with Astryx" >/dev/null 2>&1 || \
  git commit --allow-empty -m "Deploy" >/dev/null 2>&1 || true

REMOTE="https://${GH_USER}:${GH_TOKEN}@github.com/${GH_USER}/${REPO_NAME}.git"
git remote remove origin 2>/dev/null || true
git remote add origin "$REMOTE"
git push -u origin main

# Scrub the token out of the stored remote URL after pushing.
git remote set-url origin "https://github.com/${GH_USER}/${REPO_NAME}.git"

# 4) Enable GitHub Pages with the "GitHub Actions" build source.
echo "==> Enabling GitHub Pages (Actions source)..."
curl -sS -o /dev/null -w "    Pages API: HTTP %{http_code}\n" \
  -X POST "https://api.github.com/repos/${GH_USER}/${REPO_NAME}/pages" \
  -H "Authorization: Bearer ${GH_TOKEN}" \
  -H "Accept: application/vnd.github+json" \
  -d '{"build_type":"workflow"}' || true

echo
echo "==> Done. The deploy Action is now running."
echo "    Watch it:  https://github.com/${GH_USER}/${REPO_NAME}/actions"
echo "    Live URL:  https://${GH_USER}.github.io/${REPO_NAME}/"
echo
echo "    If the token was temporary, revoke it now:"
echo "    https://github.com/settings/tokens"
