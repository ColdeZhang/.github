<div align="center">

# ZHANG YUHENG // CDU PORTFOLIO

<p>
  <strong>Data & Algorithm Engineer</strong><br>
  Interactive CDU-style portfolio built with vanilla HTML, CSS and JavaScript.
</p>

<p>
  <a href="https://github.com/ColdeZhang/.github/actions/workflows/deploy-pages.yml"><img src="https://github.com/ColdeZhang/.github/actions/workflows/deploy-pages.yml/badge.svg" alt="Deploy GitHub Pages"></a>
  <a href="https://coldezhang.github.io/.github/"><img src="https://img.shields.io/badge/GitHub%20Pages-live-00c853?style=for-the-badge" alt="GitHub Pages"></a>
  <img src="https://img.shields.io/badge/Stack-HTML%20%7C%20CSS%20%7C%20JavaScript-111111?style=for-the-badge" alt="Stack">
  <img src="https://img.shields.io/badge/UI-OLED%20CDU%20Console-ff8c00?style=for-the-badge" alt="UI">
</p>

</div>

```text
> boot sequence initiated...
> operator ............... ZHANG YUHENG
> interface .............. CDU PERSONAL SYSTEM v2.0
> deployment target ...... GitHub Pages
> status ................. ALL SYSTEMS NOMINAL
```

## Overview

This repository hosts a static personal portfolio with a cockpit-display style interface, bilingual content, keyboard-driven navigation, command-line interactions and mobile-friendly layout.

Live site:

- https://coldezhang.github.io/.github/

If you want the site to live directly at `https://coldezhang.github.io/`, the repository needs to be renamed to `ColdeZhang.github.io`, or you need to bind a custom domain.

## Highlights

- CDU-inspired terminal UI with boot animation and command console.
- Bilingual content system powered by `assets/js/i18n.js`.
- Static-only architecture, ideal for GitHub Pages hosting.
- Keyboard shortcuts, swipe navigation and responsive layout.
- Zero build step, zero framework overhead, fast deploy path.

## Project Structure

```text
.
|-- index.html
|-- assets/
|   |-- css/
|   |   `-- style.css
|   `-- js/
|       |-- app.js
|       |-- content.js
|       `-- i18n.js
`-- .github/
    `-- workflows/
        `-- deploy-pages.yml
```

## CI/CD

The workflow at `.github/workflows/deploy-pages.yml` does the following:

1. Triggers on every push to `main` and on manual dispatch.
2. Configures the GitHub Pages environment.
3. Uploads the repository root as the static site artifact.
4. Deploys the site to GitHub Pages.

Because this is a pure static site, no build step is required.

## Local Preview

Use any static file server from the repository root.

```bash
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Content Editing

- Update structure and entry markup in `index.html`.
- Update visuals and responsive behavior in `assets/css/style.css`.
- Update interaction logic in `assets/js/app.js`.
- Update page rendering in `assets/js/content.js`.
- Update bilingual copy in `assets/js/i18n.js`.

## Deployment Notes

- In repository settings, ensure the Pages source is set to `GitHub Actions`.
- The included `.nojekyll` file prevents Jekyll processing from interfering with static assets.
- The workflow is safe for this repository because all asset paths are relative.

## Roadmap

- Add Open Graph image and social preview metadata.
- Add analytics or privacy-friendly visit tracking.
- Add project screenshots or demo captures to the README.
- Add a custom domain with HTTPS.
