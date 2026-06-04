#!/usr/bin/env sh
set -eu

TOKEN="${ARTIFACTORY_NPM_AUTH_TOKEN:-${artifactory_npm_auth_token:-}}"

if [ -z "$TOKEN" ]; then
  echo 'Missing ARTIFACTORY_NPM_AUTH_TOKEN or artifactory_npm_auth_token' >&2
  exit 1
fi

sed "s/NPM_TOKEN_PLACEHOLDER/$TOKEN/g" .npmrc.template > .npmrc
