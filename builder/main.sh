#!/bin/bash
export GIT_REPOSITORY_URL="$REPOSITORY_URL"

if [ -z "$REPOSITORY_URL" ]; then
  echo "Error: REPOSITORY_URL variable is not set."
  exit 1
fi

git clone "$REPOSITORY_URL" /home/app/output

exec node script.js