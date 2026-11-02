# Status – my-cv-site (2026-11-02)

## Done
- Live CV page: https://cv-gulyas-david.web.app (copy: https://g-david-s.github.io/my-cv-site/), code on GitHub (G-David-S/my-cv-site).
- English + Hungarian, dark mode, PDF CV in both languages, QR code, link preview, 404 page; uses the full width on big screens.
- Fun parts: scroll-drawn frame (ArAt picture) and flower (contact); code-lock game (4 faint random digits → cookie); coffee cup that picks a favourite Budapest café.
- Handed in as Vibe Coding Class homework 4; resubmitted 2026-11-02 15:59 with the final version.

## Where we are
- Finished. No custom domain (owner doesn't want to pay). Browsers always get the newest version (no-cache + version stamps).
- Goal line under the name left out on purpose (marked GOAL in public/index.html).

## Next
- Add the goal line when decided (EN in index.html, HU in public/i18n.js), then rebuild + deploy.
- After any text change: `sh tools/build.sh`, commit, push, deploy (commands in README.md).

## Later
- Painting gallery, a private visit counter.

## How to start
- Preview locally with the "cv-site" server (port 8130); README.md has the file map. Café list: top of the coffee part in public/script.js.
