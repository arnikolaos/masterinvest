# MASTER INVEST EmailJS integration

## Confirmed public configuration

- Service: `master_invest_form`
- Public key: `3Z_Jv6uxwKzaRMbcq`
- Company template: `template_receive`
- Visitor template: `template_reply`
- Site name: `MASTER INVEST`
- Company mailbox: `masterinvesteu@gmail.com`

These are public frontend identifiers, not private credentials. Existing dashboard templates and services are not modified.

## Exact template mappings

Company notification: `{ to_name: "MASTER INVEST Team", from_name: visitorName, email: visitorEmail, site_name: "MASTER INVEST", message: visitorMessage }`.

Visitor acknowledgement: `{ from_name: visitorName, email: visitorEmail, site_name: "MASTER INVEST" }`.

The same existing English acknowledgement is used for both locales. Form labels, validation and feedback remain English/Greek. Notification is sent first; acknowledgement follows only after acceptance and a 1.1-second delay. A failed acknowledgement does not resend the notification. Fields reset only after notification success. A separate localized success-with-acknowledgement-failure message tells the visitor not to resubmit.

## Dashboard settings to confirm (do not change template bodies)

- `template_receive`: To Email = `masterinvesteu@gmail.com`; Reply-To = `{{email}}`; From = authenticated service sender.
- `template_reply`: To Email = `{{email}}`; From = authenticated service sender.
- Do not enable an additional linked automatic reply if the frontend already sends `template_reply`; that would duplicate acknowledgements.
- If the account supports origin restrictions, authorize `https://masterinvest.gr` and `https://www.masterinvest.gr`. Keep non-browser access disabled; it is not needed by this static website.

## Verification status

2026-11-04: syntax, locale parity, TypeScript, build and 11 unit/static tests passed. Mock tests cover the exact parameter sets in both locales, notification failure, acknowledgement failure, invalid data and spam rejection. No browser automation was run, per owner instructions.

An owner-authorized live request was attempted from Node. EmailJS returned HTTP 403: non-browser API access is disabled. No successful live send or mailbox delivery is claimed. No acknowledgement was attempted after that rejection. Service/template acceptance and their dashboard recipient settings still require a browser submission.

## Finish verification

1. After deployment, submit a clearly labeled test from `/en/#contact` using your own recipient email. Check the company inbox and the visitor inbox/spam folder.
2. Repeat from `/el/#contact` after the one-minute cooldown. The website feedback should be Greek; the email acknowledgement remains English as requested.
3. Confirm that site name is MASTER INVEST, visitor details are correct, and replying to the company notification targets the visitor.
4. Only after successful end-to-end confirmation set repository variable `PUBLIC_EMAILJS_DELIVERY_VERIFIED=true` and rerun Pages. Until then the temporary connection notice remains visible on initial load even though submission is enabled.

`PUBLIC_EMAILJS_ENABLED=true` and the four confirmed identifiers are set as repository variables. `.env.example` documents the same public values for local builds. No private key, password or OAuth token is stored.

The existing full release check remains blocked by outstanding factual/privacy review and live delivery confirmation. SEO/indexing flags are unchanged.

## Revert checkpoint

Tag `checkpoint-before-emailjs-20261104` points to `8318681`, the version before this integration. Preserve later unrelated work when reverting. Repository variables must also be returned to disabled (`PUBLIC_EMAILJS_ENABLED=false`) if reverting to the unconnected contact form.
