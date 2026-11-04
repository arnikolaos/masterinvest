# MASTER INVEST deployment — new private repository, public GitHub Pages site

Prepared 4 November 2026. Target: `masterinvest.gr`; production branch: `main`; publish directory: `dist/`. The owner authorized a **new private `masterinvest` repository** and GitHub Pages. Papaki login and DNS changes still require approval. Nothing in this document grants permission to change another project.

## Current handoff status

The build is prepared locally. The execution environment could not connect to `api.github.com` through `gh`; its authentication warning therefore does not prove that the existing credentials are invalid. Repository creation, plan entitlement, Pages configuration, DNS, certificate issuance and production delivery must be verified after connectivity is restored. Use the existing CLI authentication; never print tokens, copy credentials into project files, or commit `.env`.

## Confirm account and entitlement

Run from the new `masterinvest-website` folder only:

```sh
gh auth status
gh api user --jq '{login,plan:.plan.name}'
```

If network access works but authentication truly fails, the owner signs in using `gh auth login --hostname github.com --web`. Do not request a token in chat. Confirm the intended owner before creating the repository; `arnikolaos/masterinvest` is the user-confirmed target; account entitlement still requires verification. Check billing/plan in GitHub Settings if the API does not report it.

GitHub Free does not provide Pages for a private repository; Pro, Team or Enterprise is required. Keep source private. Do not silently upgrade billing or make the repository public. The published marketing site is public even when its source repository is private. [GitHub Pages availability and visibility](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https).

## Review and create exactly one new repository

Before pushing, complete the factual/legal review and EmailJS setup in `EMAILJS.md`. Review the generated `dist/` and `docs/QA.md` when available. No secrets belong in the static output.

```sh
npm ci
npm run verify
```

Use `gh repo view OWNER/masterinvest --json nameWithOwner,isPrivate,url` as a read-only collision check. If the repository exists, STOP: do not attach this build to it or change it. If `gh` reports a connection/authentication error, resolve that error; do not treat it as evidence that the name is available. A genuine not-found result permits creation, and `gh repo create` must itself succeed before any push.

The owner-confirmed target is `arnikolaos/masterinvest`. The commands belong in the isolated new project, never its parent directory:

```sh
# Run init only when this new folder has no .git metadata.
test ! -e .git && git init -b main
# Review ignored files and the staging list before committing.
git status --short
git add .
git diff --cached --stat
git commit -m "Build MASTER INVEST bilingual static website"
# This operation must create a new repository; do not reuse an existing one.
gh repo create arnikolaos/masterinvest --private --description "MASTER INVEST bilingual website" --source=. --remote=origin
# Only after the preceding command succeeds and origin is verified:
git remote -v
git push -u origin main
```

Use existing Git credential helpers. Never insert an access token into a Git remote URL. A failed `gh repo create` is a stop condition, not a reason to run the following push.

## Enable Pages and automatic deployment

In **the newly created repository only**, Settings → Pages → Build and deployment → Source: **GitHub Actions**. The included `.github/workflows/pages.yml` verifies/builds the site and deploys `dist/` when production changes reach `main`. Add the public EmailJS build variables described in `EMAILJS.md` under Settings → Secrets and variables → Actions → Variables. The workflow uses GitHub's temporary built-in token, with deployment permissions confined to its deploy job.

The official custom workflow requires the Pages artifact, `pages: write`, `id-token: write`, a deployment job dependent on the successful build, and the `github-pages` environment. Confirm that environment permits `main`; keep branch protections appropriate to this isolated project. [GitHub custom workflow requirements](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

A CLI equivalent for initial Pages configuration, **only after confirming the new repository and its entitlement**, is:

```sh
gh api --method POST repos/arnikolaos/masterinvest/pages -f build_type=workflow
```

An already configured new project should be inspected before an update rather than repeatedly POSTed. Read state with `gh api repos/arnikolaos/masterinvest/pages`. The Pages API supports `cname` and `https_enforced` settings; do not point it at another repository. [Pages API](https://docs.github.com/en/rest/pages/pages).

## Domain plan — owner approval required before DNS changes

1. The owner signs in to Papaki and completes 2FA personally. Determine the **authoritative DNS provider** from the domain's current nameservers; registration at Papaki does not prove Papaki hosts its zone.
2. Export/screenshot the complete existing `masterinvest.gr` zone and record every affected name/type/value/TTL. Preserve MX, SPF, DKIM, DMARC and unrelated records. Do not change nameservers.
3. In GitHub **account** Settings → Pages → Add a domain, request verification of `masterinvest.gr`. Record the exact generated TXT name/value. The expected name for the confirmed personal owner is `_github-pages-challenge-arnikolaos`; its value is owner-specific and is **not available yet**. Obtain approval before adding it. Keep the verification TXT after verification. [Domain verification](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages).
4. In the **new repository's** Pages settings, save custom domain `masterinvest.gr` before directing web traffic there.
5. Present the current records alongside the exact proposed replacements below and obtain owner approval. Only conflicting web records at `@` or `www` may need replacement. Never indiscriminately clear the DNS zone.

| Name | Type | Proposed value | Purpose |
|---|---|---|---|
| `@` | A | `185.199.108.153` | GitHub Pages IPv4 |
| `@` | A | `185.199.109.153` | GitHub Pages IPv4 |
| `@` | A | `185.199.110.153` | GitHub Pages IPv4 |
| `@` | A | `185.199.111.153` | GitHub Pages IPv4 |
| `@` | AAAA | `2606:50c0:8000::153` | Optional IPv6 |
| `@` | AAAA | `2606:50c0:8001::153` | Optional IPv6 |
| `@` | AAAA | `2606:50c0:8002::153` | Optional IPv6 |
| `@` | AAAA | `2606:50c0:8003::153` | Optional IPv6 |
| `www` | CNAME | `arnikolaos.github.io` | Confirm owner before applying |
| `_github-pages-challenge-arnikolaos` | TXT | Exact value supplied by GitHub | Ownership verification |

Use a provider-supported TTL such as 3600 seconds; retain current TTLs if the owner prefers. The `www` target has no protocol, repository path or trailing `/`. Never create a wildcard. If existing CAA records restrict issuance, inspect the failure and obtain approval for a narrowly scoped correction; do not remove CAA automatically.

These IPs and the apex/subdomain relationship were checked against [GitHub's custom domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). The production canonical host is the apex. With both names correctly configured, GitHub handles the `www` redirect to the configured apex. A `CNAME` file alone does not configure an Actions-hosted Pages domain: the repository setting is essential.

## HTTPS and production verification

Wait for GitHub's DNS check and certificate provisioning to succeed. Then enable **Enforce HTTPS** under the new repository's Pages settings. Inspect `https_certificate`, `https_enforced`, `cname` and `html_url` in Pages API output. Both hostname variants must have a valid certificate before calling the launch complete.

```sh
dig +short A masterinvest.gr
dig +short AAAA masterinvest.gr
dig +short CNAME www.masterinvest.gr
dig +short TXT _github-pages-challenge-arnikolaos.masterinvest.gr
curl -I https://masterinvest.gr/en/
curl -I https://masterinvest.gr/el/
curl -I http://masterinvest.gr/en/
curl -I https://www.masterinvest.gr/en/
openssl s_client -connect masterinvest.gr:443 -servername masterinvest.gr </dev/null 2>/dev/null | openssl x509 -noout -dates -issuer -ext subjectAltName
openssl s_client -connect www.masterinvest.gr:443 -servername www.masterinvest.gr </dev/null 2>/dev/null | openssl x509 -noout -dates -issuer -ext subjectAltName
```

Check from more than one resolver/network after propagation. Confirm HTTP → HTTPS, `www` → apex (preserving path), default English entry, direct `/en/` and `/el/` refresh, all local assets, 404, canonical/hreflang/sitemap, keyboard/mobile behavior, privacy links, and actual EN/EL email receipts. Check Console/Network for errors and mixed content. A mocked EmailJS test or successful HTTP response is not proof of inbox delivery. Record deployment SHA, workflow URL, timestamp, certificates, screenshots and test outcome in the QA report.

## Rollback

For a site regression, revert the faulty commit **in this new repository only**, push the revert to `main`, and verify the prior behavior after the workflow succeeds. Never force-push or reset another project. For a DNS regression, ask the owner to approve restoring only the affected records from the saved zone snapshot. Keep the verified-domain TXT. If retiring Pages later, remove approved DNS pointers before relinquishing the Pages binding to avoid an orphaned domain. EmailJS rollback means disabling this project's form or restoring its own previous IDs; existing MI services remain untouched.

## Build and release controls

Node.js 22 or newer is required. This project uses a custom static Node builder with no runtime package dependencies. For production set `SITE_ORIGIN=https://masterinvest.gr` and leave `SITE_BASE_PATH` empty. For the GitHub project preview use the GitHub origin and `SITE_BASE_PATH=/masterinvest`. Set `PUBLIC_EMAILJS_ENABLED=true` only after configuring the new service and templates.

The release gate requires `RELEASE_APPROVED` and the `site.launch` booleans `factualAndPermissionsReviewed`, `privacyReviewed`, and `emailDeliveryVerified`. These must reflect completed owner review and live email verification, not merely successful mocked tests. Keep the gate closed until those conditions are met.
