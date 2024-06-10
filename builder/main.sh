#!/bin/bash
export GIT_REPOSITORY_URL="$REPOSITORY_URL"

git clone "$REPOSITORY_URL" /home/app/output

exec node script.js