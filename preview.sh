#!/bin/zsh
# Serve app.html on localhost:8931 for live review.
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
printf '<!doctype html>\n<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>\n' > "$DIR/local-test.html"
cat "$DIR/app.html" >> "$DIR/local-test.html"
printf '\n</body></html>\n' >> "$DIR/local-test.html"
pkill -f "http.server 8931" 2>/dev/null || true
cd "$DIR" && python3 -m http.server 8931 &
sleep 1
echo "Preview: http://localhost:8931/local-test.html"
