"""Makes public/assets/qr.svg: a one-colour QR code that points to the live site.

The page colours it with CSS, so it follows light and dark mode.
Change SITE_URL when the custom domain is live, then run:
    ../.venv312/bin/python tools/make_qr.py
"""
from pathlib import Path

import qrcode

SITE_URL = "https://cv-gulyas-david.web.app"

qr = qrcode.QRCode(border=0, error_correction=qrcode.constants.ERROR_CORRECT_M)
qr.add_data(SITE_URL)
qr.make(fit=True)
matrix = qr.get_matrix()
size = len(matrix)

# One path with a 1x1 square per dark module keeps the file small.
squares = "".join(
    f"M{x} {y}h1v1h-1z"
    for y, row in enumerate(matrix)
    for x, dark in enumerate(row)
    if dark
)
svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" '
    f'shape-rendering="crispEdges"><path d="{squares}"/></svg>\n'
)
out = Path(__file__).resolve().parent.parent / "public" / "assets" / "qr.svg"
out.write_text(svg)
print(f"{out.name}: {size}x{size} modules -> {SITE_URL}")
