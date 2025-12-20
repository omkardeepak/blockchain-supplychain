#!/usr/bin/env bash
set -euo pipefail

echo "--- docker-entrypoint debug ---"
bash --version 2>/dev/null || true
node --version 2>/dev/null || true
echo "Contents of /app:"
ls -la /app || true
echo "-------------------------------"



if [ "$#" -eq 0 ]; then
  echo "No command provided. Starting frontend server by default..."
  exec npm start
else
  echo "Starting command: $*"
  exec "$@"
fi
