# EmailJS — isolated MASTER INVEST service

Prepared 4 November 2026. No live service has been connected and no deliverability test has been completed. The owner must authorize Gmail OAuth in the provider UI. Do not change the existing `mistudio` service, default service, or any existing template.

## Plan and isolation check

The currently published free plan provides 200 requests/month and two templates; domain allowlisting is shown on paid plans, not Free. Each successful enquiry normally causes two sends, so budget approximately 100 enquiries/month before tests, retries or other account use. Existing account use consumes the same quota. The public pricing page does **not** state the maximum connected email-service count, so inspect the actual account's service allowance before proceeding. If a new Gmail service or two new templates cannot be added, stop and ask the owner to choose a separate account or approved plan change. Never reuse `mistudio` or delete an existing template to fit the limit. [EmailJS current pricing](https://www.emailjs.com/pricing/).

## Owner setup in EmailJS

1. Sign in personally at [EmailJS](https://dashboard.emailjs.com/). Confirm available service/template capacity.
2. Email Services → Add New Service → Gmail. Create a new service named **MASTER INVEST Gmail**, suggested ID `masterinvest_gmail`. Click Connect account and authenticate **masterinvesteu@gmail.com** personally in Google's OAuth window. Confirm the mailbox before finalizing. Keep the existing default-service selection unchanged; the website always supplies an explicit service ID. If the UI would change a shared default automatically, stop rather than reconfiguring another site's behavior. [EmailJS service setup](https://www.emailjs.com/docs/tutorial/adding-email-service/).
3. Create two **new** templates with the settings below. Leave the provider's automatic linked auto-reply feature off: this implementation sends the second template itself, after the first succeeds.
4. Copy only the public key, new service ID and two new template IDs into local build configuration. No Gmail password, OAuth token, EmailJS private key or account credentials belong in the browser or repository.

## Template A: internal notification

Name: `masterinvest_contact_notification`.

| Setting | Value |
|---|---|
| To email | `masterinvesteu@gmail.com` (fixed) |
| From name | `MASTER INVEST Website` |
| From email | Authenticated sender / default email address for this new Gmail service |
| Reply-To | `{{reply_email}}` |
| Subject | `MASTER INVEST \| New Website Enquiry — masterinvest.gr` |
| Content | `email-templates/notification.html` (HTML), or `notification.txt` (plain text) |

Do not set From to the visitor. Keep the recipient fixed. The visitor's input belongs only in escaped double-brace template variables. Do not insert `{{{message}}}` or other triple-brace variables.

## Template B: bilingual acknowledgement

Name: `masterinvest_contact_autoreply`.

| Setting | Value |
|---|---|
| To email | `{{reply_email}}` |
| From name | `MASTER INVEST` |
| From email | Authenticated sender / default email address for this new Gmail service |
| Reply-To | `masterinvesteu@gmail.com` |
| Subject | Paste the single line from `email-templates/autoreply-subject.txt` |
| Content | `email-templates/autoreply.html` (HTML), or `autoreply.txt` (plain text) |

The application sends boolean `is_greek` (`true` for `el`, `false` for `en`). The subject and body use positive/inverted Mustache sections to choose the approved language. EmailJS documents conditional sections and escapes double-brace variables. Test both branches in the dashboard and in delivered messages. If conditional subject/body rendering does not work in the actual account, stop and use two new locale-specific acknowledgement templates only after the owner approves additional template capacity; adjust the adapter accordingly. [Template variables and conditionals](https://www.emailjs.com/docs/user-guide/dynamic-variables-templates/).

## Public build configuration

Use `.env.example` as the source of truth. Intended public keys:

```dotenv
PUBLIC_EMAILJS_ENABLED=true
PUBLIC_EMAILJS_SERVICE_ID=masterinvest_gmail
PUBLIC_EMAILJS_PUBLIC_KEY=replace_with_public_key
PUBLIC_EMAILJS_NOTIFICATION_TEMPLATE=replace_with_new_notification_template_id
PUBLIC_EMAILJS_AUTOREPLY_TEMPLATE=replace_with_new_autoreply_template_id
```

Store local values in ignored `.env`. For GitHub Actions use repository **Variables**, with names matching the workflow. These values are identifiers included in built JavaScript; their visibility is expected. Do not use an EmailJS private key. Rebuild after changing identifiers. Test first on an approved origin, then production; never send a real enquiry automatically during CI.

## Delivery and abuse controls

The browser sends JSON to `https://api.emailjs.com/api/v1.0/email/send` with `service_id`, `template_id`, `user_id` (public key), and `template_params`. It sends the internal notification first, waits more than one second, and only then sends acknowledgement. EmailJS documents a one-request-per-second limit. If the notification fails, no acknowledgement should be sent. If acknowledgement fails, preserve success for the received enquiry; record only a safe diagnostic code, never name, email or message. [EmailJS send API](https://www.emailjs.com/docs/rest-api/send/).

Enforce input lengths, email syntax/header-character rejection, hidden honeypot, a submission cooldown and a request timeout. Browser checks can be bypassed, so they do not replace provider controls. In a plan that supports allowlisting, approve only `https://masterinvest.gr` and any narrowly scoped testing origin; include `https://www.masterinvest.gr` only if it serves the app before redirect. Do not change account-wide controls in a shared account if that would affect existing sites. Review quota alerts and provider protection settings; introduce CAPTCHA only if justified and after reconciling it with the approved three-field UX.

Review template history/retention settings with the owner and reflect the selected policy in the privacy text. Avoid storing personal message content in debug logs or analytics. Confirm the sender's mailbox and EmailJS/Google processing terms during legal review.

## Required live test record

Use an owner-controlled test recipient and clearly labeled test enquiries. Fill this table after actual setup; all rows begin pending.

| Scenario | Required evidence | Status |
|---|---|---|
| English enquiry | Internal email received; English acknowledgement received; inbox/spam inspected | Pending |
| Greek enquiry | Internal email received; Greek subject/body rendered correctly; UTF-8 intact | Pending |
| Reply-To | Reply to internal notice opens visitor's test address; From remains authenticated | Pending |
| Notification rejected | Error shown; no acknowledgement attempted | Pending live / automated mock separately |
| Acknowledgement rejected | Enquiry success retained; no duplicate internal send | Pending live / automated mock separately |
| Invalid input / honeypot | No outbound request | Pending QA |
| Cooldown / repeated click | Duplicate submission suppressed | Pending QA |
| Timeout/offline | Clear feedback and direct-contact alternative | Pending QA |
| Production origin | Both locale forms work after HTTPS/domain activation | Pending |

A REST `200` means the provider accepted the request; it does not prove inbox delivery or spam placement. Final sign-off requires checking both mailboxes, the localized templates, quota/allowlist behavior, and the actual production URL.
