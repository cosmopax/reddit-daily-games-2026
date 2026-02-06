#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SHARED_TSC="$ROOT_DIR/packages/shared/node_modules/.bin/tsc"

if [[ ! -x "$SHARED_TSC" ]]; then
  echo "missing compiler: $SHARED_TSC"
  echo "run dependency install in /packages/shared first"
  exit 1
fi

games=(
  "game-01-strategy"
  "game-02-trivia"
  "game-03-meme"
  "game-04-duel"
)

echo "== smoke: shared =="
"$SHARED_TSC" -p "$ROOT_DIR/packages/shared/tsconfig.json" --noEmit

for game in "${games[@]}"; do
  echo "== smoke: $game =="
  "$SHARED_TSC" -p "$ROOT_DIR/packages/$game/tsconfig.json" --noEmit
done

echo "smoke checks complete"
