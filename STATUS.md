# Status – my-cv-site (2026-11-05)

## Done
- Live CV page: https://cv-gulyas-david.web.app (copy: https://g-david-s.github.io/my-cv-site/), code on GitHub (G-David-S/my-cv-site). Last deploy 2026-11-05.
- Short and focused on purpose (keep it that way): profile, two projects (ArAt, Reador's Cards) with art banners, Experience, Education, Skills with line icons, Languages, contact.
- Look: Swiss-poster hero + hairline tile grid, Montserrat, midnight blue/beige with terracotta + teal accents, soft grey dark mode, flower and frame line art, scroll/entrance motion (respects reduced motion).
- Extras kept: code-lock puzzle with hidden digits and cookie, QR card, faint code trail behind the mouse (normal cursor stays).
- English + Hungarian, PDF CV in both (2 pages), SEO (meta, JSON-LD, robots, sitemap), email opens an in-page row (mail app / Gmail / copy).

## Where we are
- Finished and deployed. No custom domain (owner doesn't want to pay).
- Goal line under the name left out on purpose (the role line is there instead).
- Removed on request: coffee cup, path chart, duel mini game, scope-style cursor, ruler under the number.

## Next
- Add real numbers to the experience bullets (follower growth, ROI result, sales) when the owner has them.
- After any change: `sh tools/build.sh`, commit, push, deploy (commands in README.md).

## Later
- Possible follower-growth chart (needs real data), painting gallery, a private visit counter.

## How to start
- Preview server "cv-site" (port 8130); README.md has the file map. Browsers cache index.html: open with `?nocache=N` after edits.
