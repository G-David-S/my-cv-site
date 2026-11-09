# Status – my-cv-site (2026-11-09)

## Done
- Site rebuilt in the osply.co style: giant DÁVID over the layered painting (depth, mouse light, snow), work list with picture panel, bullet-point About, CV paper rising at the bottom. Night is the default; EN + HU.
- Old version backed up on GitHub: branch + tag `old-version`.
- Live: https://cv-gulyas-david.web.app (Firebase) + GitHub Pages mirror. Security headers + CSP in firebase.json; accessibility fixes done.
- Easter egg: catch 5 golden snowflakes -> secret art-background CV (PDF, EN/HU) + collectible card (Maths 8, Finance 10). No colour-change/dawn effect (owner didn't want it).
- Homework 4 resubmitted on vibecodingclass.hu (2026-11-09 22:18).

## Where we are
- Everything committed, pushed and deployed. Readors Exped shows "In development" (private repo, no link). Café Notes and Analysis Lab are "Coming soon" rows.

## Next
- Real numbers for the bullets (follower growth, ROI, sales).
- Look at intro + mouse effects on a real phone.
- Retake the classroom screenshot if wanted (current one is pre-egg).

## Later
- Build the Café Notes and Analysis Lab pages; link Readors Exped when it has a public demo; add a photo.

## How to start
- Preview server "cv-site" (port 8130); add `?still` to skip the intro. After CV text changes: `sh tools/build.sh`, commit, push, `firebase deploy --only hosting --project cv-gulyas-david`.
