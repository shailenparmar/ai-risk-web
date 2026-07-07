#!/bin/zsh
# Wrap app.html into the deployable page inside shailenparmar.com, build, and deploy.
set -e
SRC="$(cd "$(dirname "$0")" && pwd)/app.html"
SITE=/Users/shailen/projects/shailenparmar.com
OUT=$SITE/public/airiskweb/index.html

node "$(dirname "$0")/check.mjs"   # data integrity gate

printf '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>AI Risk Web — an interactive concept map for AI risk</title>\n<meta name="description" content="The concepts from 80,000 Hours&#39; 11 essential resources on AI risk. Explore a walk through each source&#39;s key concepts.">\n<link rel="icon" href="favicon.svg">\n</head>\n<body>\n' > "$OUT"
cat "$SRC" >> "$OUT"
printf '\n</body>\n</html>\n' >> "$OUT"

cd "$SITE"
npm run build
npx wrangler deploy
echo "Deployed: https://shailenparmar.com/airiskweb/"
echo "Remember: git add public/airiskweb/index.html && git commit && git push (in shailenparmar.com)"
