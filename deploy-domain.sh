#!/bin/zsh
# Deploy app.html as its OWN standalone Worker at airiskweb.com — independent of shailenparmar.com.
# Run this alongside (not instead of) build.sh; the two deploys are separate.
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
SRC="$DIR/app.html"
OUT="$DIR/domain-dist/index.html"

node "$DIR/check.mjs"   # data integrity gate

mkdir -p "$DIR/domain-dist"
cp "$DIR"/../shailenparmar.com/public/airiskweb/favicon.svg "$DIR/domain-dist/favicon.svg" 2>/dev/null || true
cp "$DIR/style-guide.html" "$DIR/domain-dist/style-guide.html"   # ship the style guide alongside the app

printf '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>AI Risk Web — an interactive concept map for AI risk</title>\n<meta name="description" content="The concepts from 80,000 Hours&#39; 11 essential resources on AI risk. Explore a walk through each source&#39;s key concepts.">\n<link rel="canonical" href="https://airiskweb.com/">\n<link rel="icon" href="/favicon.svg">\n</head>\n<body>\n' > "$OUT"
cat "$SRC" >> "$OUT"
printf '\n</body>\n</html>\n' >> "$OUT"

cd "$DIR"
npx wrangler deploy
echo "Deployed: https://airiskweb.com/"
