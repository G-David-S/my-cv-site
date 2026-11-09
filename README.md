# my-cv-site

Personal site of **Dávid Sámuel Gulyás**: painter, finance and maths student, builder.

- Live (Firebase Hosting): https://cv-gulyas-david.web.app
- Mirror (GitHub Pages): https://g-david-s.github.io/my-cv-site/
- The previous version (Swiss grid, tiles, ArAt + Reador's Cards) is kept as branch and tag `old-version` on GitHub.

New look (2026-11-09), inspired by osply.co: giant name over the owner's layered painting (depth parallax, mouse light, snow), numbered work list with a picture panel, CV paper that rises while scrolling. English + Hungarian, dark + light.

## Files

| Path | What it is |
| --- | --- |
| `public/index.html` | The whole site: HTML, CSS and JS in one file (no build) |
| `public/art/` | The 11 painting layers (webp), Corvinus logo, favicon |
| `public/assets/preview.png` | Link preview image (made by `tools/build.sh`) |
| `public/cv-gulyas-david-samuel(-hu).pdf` | One-page CV, English and Hungarian (made by `tools/build.sh`) |
| `tools/cv-print.html` | The CV text for the PDFs; change CV wording here AND in `public/index.html` |
| `tools/build.sh` | Rebuilds both PDFs and the preview image |
| `firebase.json`, `.firebaserc` | Firebase Hosting settings |
| `.github/workflows/pages.yml` | Publishes `public/` to GitHub Pages on every push |

## Update the site

```sh
sh tools/build.sh                     # only if the CV text changed
git add -A && git commit -m "..." && git push
firebase deploy --only hosting --project cv-gulyas-david
```
