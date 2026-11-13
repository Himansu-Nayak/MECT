# MECT — Privacy, Data Rights & Consent Governance Report

## Classification Summary
- **Implemented:** Explicit, separate consent checkboxes (SMS/WhatsApp opt-in strictly separate from donation checkout and off by default), timestamped consent audit records (`communication_consents` with `consent_version`, `consent_source`, `consent_text`, `consented_at`, `opt_out_at`), email preferences (`email_receipts_enabled`, `email_updates_enabled`), optional public donation anonymity (`donations.is_anonymous`), optional masked PAN handling (`panMasked`), and supporter-initiated account deletion requests (`POST /api/v1/portal/me/deletion-request`).
- **Tested successfully:** Opted-out WhatsApp suppression, anonymous donation masking in public/donor display logic, PAN masking in DTO responses, and deletion-request logging in `portal_users`.
- **Requires legal or organisational confirmation:** Organisational privacy notice wording & retention schedule sign-off by Trust legal counsel confirming how financial donation/receipt ledgers (`donations`, `donation_receipts`) are retained alongside user profile erasure/anonymisation per Indian Trust & tax statutory accounting laws.

