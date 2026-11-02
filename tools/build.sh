#!/bin/sh
# Rebuilds the downloadable PDF and the link preview image from the site.
# Run from the my-cv-site folder after changing the page: sh tools/build.sh
set -e
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
cd "$(dirname "$0")/.."

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
