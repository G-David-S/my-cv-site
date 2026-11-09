#!/bin/sh
# Rebuilds the downloadable PDFs (from tools/cv-print.html) and the link preview image (a screenshot of the site).
# Run from the my-cv-site folder after changing the content: sh tools/build.sh
set -e
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
cd "$(dirname "$0")/.."
python3 -m http.server 8131 --directory . >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER' EXIT
sleep 1
"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=6000 --print-to-pdf=public/cv-gulyas-david-samuel.pdf "http://localhost:8131/tools/cv-print.html?lang=en" 2>/dev/null
"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=6000 --print-to-pdf=public/cv-gulyas-david-samuel-hu.pdf "http://localhost:8131/tools/cv-print.html?lang=hu" 2>/dev/null
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --window-size=1200,630 --virtual-time-budget=9000 --screenshot=public/assets/preview.png "http://localhost:8131/public/index.html?still" 2>/dev/null
echo "Done: both PDFs and public/assets/preview.png"
