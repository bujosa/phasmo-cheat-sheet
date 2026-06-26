#!/usr/bin/env bash
# Refreshes the locally-bundled Phasmophobia data in ../data-local/.
#
# This fork serves ghost/map/weekly/language data from data-local/ so it works
# standalone, without the gated zero-network.net API. Run this script whenever
# you want to pull the latest data snapshot from the upstream API.
#
# Usage:  ./scripts/update-data.sh
set -euo pipefail

cd "$(dirname "$0")/.."
OUT="data-local"
mkdir -p "$OUT"

UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
HDR=(
  -H "User-Agent: $UA"
  -H "Accept: application/json"
  -H "Origin: https://tybayn.github.io"
  -H "Referer: https://tybayn.github.io/"
  -H "Sec-Fetch-Site: cross-site"
  -H "Sec-Fetch-Mode: cors"
  -H "Sec-Fetch-Dest: empty"
)
BASE="https://zero-network.net/phasmophobia"
# This fork ships Spanish only (with English as the translation fallback). The
# other languages + their CJK fonts were removed to keep the repo small. If you
# want them back, add their codes here AND restore lang-v10/<code>/ + the fonts.
LANGS=(es en)

echo "Downloading ghost data for ${#LANGS[@]} languages..."
for L in "${LANGS[@]}"; do
  curl -fsS "${HDR[@]}" "$BASE/data/ghosts.json?lang=$L" -o "$OUT/ghosts-$L.json"
  echo "  ghosts-$L.json"
done

echo "Downloading maps / weekly / languages..."
curl -fsS "${HDR[@]}" "$BASE/data/maps"        -o "$OUT/maps.json"
curl -fsS "${HDR[@]}" "$BASE/data/weekly.json" -o "$OUT/weekly.json"
curl -fsS "${HDR[@]}" "$BASE/languages"        -o "$OUT/languages.json"

echo "Validating JSON..."
for f in "$OUT"/*.json; do
  python3 -c "import json,sys; json.load(open(sys.argv[1]))" "$f" || { echo "INVALID: $f"; exit 1; }
done

echo "Done. Data snapshot refreshed in $OUT/"
