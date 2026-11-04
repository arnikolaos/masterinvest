# QA — 2026-11-04

Source syntax checks, locale parity checks, TypeScript contracts, static build and all 11 unit/static tests pass. Dependency audit reports zero vulnerabilities (evidence/dependency-audit.json).

Chromium passed 16 browser groups: EN/EL at 320, 390, 768, 1440 and 2560 pixels, axe WCAG A/AA checks, three visible fields, validation, reduced-motion video suppression, dialog controls, mobile navigation, locale links and mocked notification/acknowledgement success/failure. Full-page screenshots and axe results are in evidence/. Firefox/WebKit results appear in browser-report.json when complete.

No live EmailJS messages were sent; no live delivery or spam placement is verified. Lighthouse/Core Web Vitals and physical iOS/Safari tests are outstanding. All preview builds remain noindex until legal/factual review and email verification are approved. GitHub Pages activation was rejected by GitHub because the current plan does not support private-repository Pages. DNS/TLS/production checks are therefore pending.
