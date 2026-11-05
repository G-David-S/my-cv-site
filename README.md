# my-cv-site

My personal CV page: **Gulyás Dávid Sámuel**, artist, builder and problem solver.

- Live (Firebase Hosting): https://cv-gulyas-david.web.app
- Mirror (GitHub Pages): https://g-david-s.github.io/my-cv-site/

![Screenshot of the live site](docs/screenshot.png)

Built for Lesson 4 of the Vibe Coding Class (2026 autumn) with a coding agent.
Plain HTML and CSS, plus a little JavaScript for dark mode, scroll animations and the email link.

## Files

| Path | What it is |
| --- | --- |
| `public/index.html` | The page content |
| `public/style.css` | Look: colours, layout, dark mode, phone layout, print/PDF layout |
| `public/script.js` | Dark mode, HU/EN switch, number counter, scroll-drawn flower/frame, skill-icon and heading-line drawing, code-lock game, email choices (mail app / Gmail / copy), faint code trail behind the mouse |
| `public/i18n.js` | Hungarian texts (English is in index.html) |
| `public/404.html` | Page shown for addresses that don't exist |
| `public/robots.txt`, `public/sitemap.xml` | For search engines (SEO); the page also has meta tags and JSON-LD in `index.html` |
| `public/cv-gulyas-david-samuel.pdf`, `-hu.pdf` | Downloadable CV in English and Hungarian (made from the page) |
| `public/assets/` | ArAt and Reador's Cards pictures, Corvinus logo, favicon, QR code, link preview image |
| `tools/build.sh` | After a change: version-stamps style/script links (so browsers never show a stale mix), rebuilds the PDFs and preview image |
| `tools/make_qr.py` | Makes the QR code (`public/assets/qr.svg`); change the address in it when the domain changes |
| `firebase.json`, `.firebaserc` | Firebase Hosting settings (publishes `public/`; pages, styles and scripts are always re-checked by browsers) |
| `.github/workflows/pages.yml` | Publishes `public/` to GitHub Pages on every push |

## Update the site

```sh
sh tools/build.sh                     # only if the content changed: new PDF + preview
git add -A && git commit -m "..." && git push    # GitHub + GitHub Pages
firebase deploy --only hosting --project cv-gulyas-david   # Firebase
```
