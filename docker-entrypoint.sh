#!/bin/sh
set -eu
DATA_PATH="${DATA_DIR:-/data}"
mkdir -p "$DATA_PATH"
# Railway/Fly volumes remount over image /data as root-owned; chown then drop to node.
if [ "$(id -u)" = "0" ]; then
  if chown -R node:node "$DATA_PATH" 2>/dev/null && command -v runuser >/dev/null 2>&1; then
    exec runuser -u node -- "$@"
  fi
  echo "docker-entrypoint: starting as root so SQLite can open ${DATA_PATH}" >&2
fi
exec "$@"
