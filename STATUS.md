# Status – my-cv-site (2026-11-02)

## Done
- Live CV page: https://cv-gulyas-david.web.app (copy: https://g-david-s.github.io/my-cv-site/), code on GitHub (G-David-S/my-cv-site).
- English + Hungarian (HU/EN button), dark mode, PDF CV in both languages, QR code, link preview, 404 page.
- Two stop-motion drawings that follow scrolling: a frame around the ArAt picture, a flower above the contact.
- Wide-screen layout (two-column hero, Experience + Education side by side) and a code-lock game: 4 faint random digits on the page open a lock that draws a cookie.
- Coffee corner under "Outside work": steaming cup; tap it for a random favourite Budapest café (list at the top of the coffee code in public/script.js).
- Handed in as Vibe Coding Class homework 4 on 2026-11-02 14:16.

## Where we are
- Finished and submitted. No custom domain (owner doesn't want to pay for one).
- The goal line under the name is left out on purpose (marked GOAL in public/index.html).

## Next
- Add the goal line when decided (English in index.html, Hungarian in public/i18n.js), then rebuild + deploy.
- After any text change: `sh tools/build.sh` (new PDFs + preview), commit, push, deploy (commands in README.md).

## Later
- Painting gallery, a private visit counter.

## How to start
- Preview locally with the "cv-site" server (port 8130); read README.md for the file map.
