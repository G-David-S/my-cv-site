#!/bin/sh
# Rebuilds the downloadable PDF and the link preview image from the site.
# Run from the my-cv-site folder after changing the page: sh tools/build.sh
set -e
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
cd "$(dirname "$0")/.."

# Version stamps: style.css?v=…, script.js?v=… in index.html change whenever the file changes,
# so browsers never mix a new page with an old cached style or script.
for f in style.css i18n.js script.js; do
  v=$(shasum public/$f | cut -c1-8)
  sed -i '' -E "s#(href|src)=\"$f(\?v=[0-9a-f]+)?\"#\1=\"$f?v=$v\"#" public/index.html
done

python3 -m http.server 8131 --directory public >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER' EXIT
sleep 1

"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=5000 \
  --print-to-pdf=public/cv-gulyas-david-samuel.pdf "http://localhost:8131/?lang=en" 2>/dev/null

"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=5000 \
  --print-to-pdf=public/cv-gulyas-david-samuel-hu.pdf "http://localhost:8131/?lang=hu" 2>/dev/null

"$CHROME" --headless=new --disable-gpu --hide-scrollbars --window-size=1200,630 --virtual-time-budget=5000 \
  --allow-file-access-from-files --screenshot=public/assets/preview.png "file://$PWD/tools/preview.html" 2>/dev/null

echo "Done: public/cv-gulyas-david-samuel.pdf, public/cv-gulyas-david-samuel-hu.pdf and public/assets/preview.png"
