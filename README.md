# MASTER INVEST

An independent bilingual static website built from `MASTER_INVEST_CODEX_MASTER.md`. Target: **masterinvest.gr**. Intended private repository: **arnikolaos/masterinvest**, production branch `main`, hosting GitHub Pages. This project has no runtime framework or server requirement. A small Node compiler produces ordinary `.html`, `.css`, `.js` and local multimedia files.

**Current state:** local preview package. Publication is gated on owner factual/legal review, real EmailJS delivery, passing browser QA and account/DNS setup. See [QA report](docs/QA.md) and [launch status](docs/LAUNCH.md). No live delivery or deployment is implied.

## Run

Node 22 or newer (24 LTS recommended):

```sh
npm ci
npm run verify
npm run dev
```

Open **http://127.0.0.1:4173/en/** or **http://127.0.0.1:4173/el/**. Keep the terminal running. Use HTTP, not double-clicked `file://` pages: ES modules require a web origin. `dist/` is the deployable output; source changes require `npm run build`.

```sh
npx playwright install chromium firefox webkit
BROWSERS=chromium,firefox,webkit npm run test:browser
```

Browser tests intercept an isolated test hostname and mock EmailJS; no actual messages are sent. See evidence reports for tests actually executed. Real iOS/Safari and EmailJS delivery require separate checks.

## Project map

```text
src/
  components/       reusable HTML module renderers and registry
  content/          approved EN/EL copy, UI strings, legal drafts
  data/             site settings, typed project schema, media alt text
  styles/           design tokens, global rules, responsive components
  motion/           progressive motion, hero video, reduced motion
  lib/              validation, EmailJS adapter, contact UI
  app.js            navigation, language continuity, media viewer
public/
  multimedia/
    architecture/   AI concept images, responsive WebP/JPEG
    destinations/   licensed documentary location photographs
    video/          silent 10-second H.264 hero loop
    fonts/          reserved; site uses system fonts
  icons/            favicon and touch icon
  og/               1200×630 social preview
scripts/            build, preview, checks and release gate
 tests/             unit/static and real-browser test suites
 docs/              editing, assets, EmailJS, deployment and QA
 evidence/          actual local results; CI adds screenshots/audits
 .github/workflows/ automatic verification and gated Pages deployment
 dist/              generated website (not committed)
 originals/         local high-quality generated images (not deployed)
```

## Editing and launch

- [Content and module guide](docs/CONTENT.md)
- [Media provenance and prompts](docs/assets-manifest.json)
- [Destination licenses](docs/destination-sources.json)
- [EmailJS setup and templates](docs/EMAILJS.md)
- [GitHub Pages, Papaki DNS, HTTPS and rollback](docs/DEPLOYMENT.md)
- [Outstanding launch steps](docs/LAUNCH.md)

Copy `.env.example` to `.env` for public EmailJS identifiers. No password, OAuth token, private EmailJS key or Google credential belongs in this project. English is always the root default; locale routes are explicit and never browser-locale redirected. The root renders English with `/en/` as canonical. Explicit language selection records a preference and preserves section position.

All concept galleries are clearly illustrative and unavailable as investment offerings. Image credits retain the individual Creative Commons licenses independently of site copyright. No analytics or marketing cookies are installed. The privacy text is a review draft, not a statement that owner compliance decisions have been completed.

The workflow verifies every push to `main`; deployment runs only when repository variable `RELEASE_APPROVED=true`, the source review flags are confirmed, configured EmailJS is enabled and browser checks pass. GitHub Pages cannot enforce custom HTTP security headers; the site includes a compatible meta CSP, and this hosting limitation is documented.
