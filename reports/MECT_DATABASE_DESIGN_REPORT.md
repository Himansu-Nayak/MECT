# MECT — Database Design & Flyway Schema Report

## Classification Summary
- **Implemented:** Flyway SQL migrations `V7__portal_users_and_otp_schema.sql`, `V8__donations_payments_and_receipts_schema.sql`, and `V9__notification_outbox_schema.sql` targeting PostgreSQL 18 (verified in H2 PostgreSQL compatibility mode), 16 JPA entities, and 16 Spring Data JPA repositories.
- **Tested successfully:** Schema migration execution, constraint uniqueness (`user_uuid`, `primary_email`, `primary_phone`, `provider_event_id`, `receipt_number`, `event_key`), bytea PDF binary persistence, and repository queries executed in automated Spring Boot tests.
- **Requires organisational confirmation:** Applying `V7`–`V9` migrations against the live Hostinger PostgreSQL `mect_db` instance during release deployment (existing `V1`–`V6` tables remain untouched).

## Schema Breakdown

### `V7__portal_users_and_otp_schema.sql` (Identity, OTP, Preferences & Consent)
| Table | Purpose & Key Constraints |
|---|---|
| `portal_users` | Isolated public portal accounts (`user_uuid` unique, `primary_email` unique, `primary_phone` unique, `profile_completed`, `deletion_requested`, optimistic `@Version`). |
| `portal_user_roles` | Normalized portal roles (`ROLE_GENERAL_USER`, `ROLE_DONOR`) with `UNIQUE (portal_user_id, role_name)`. |
| `portal_user_profiles` | Legal name, mailing address (`address_line`, `city`, `state`, `pin_code`, `country`), `preferred_language`, optional `pan_optional` (returned masked in DTOs). |
| `portal_verified_contacts` | Verified emails/phones linked to a user with global uniqueness `UNIQUE (contact_type, contact_value)`. |
| `otp_verifications` | Purpose (`LOGIN`, `CONTACT_CHANGE`), channel, `otp_hash`, `attempts`, `max_attempts`, `expires_at`, `resend_available_at`, `used_at`, `request_ip`. |
| `portal_refresh_tokens` | SHA-256 hashed rotating refresh tokens (`token_hash` unique, `revoked`, `expires_at`). |
| `notification_preferences` | `email_receipts_enabled`, `email_updates_enabled` toggles per portal user. |
| `communication_consents` | Auditable opt-in/opt-out ledger (`channel`, `phone_number`, `consent_status`, `consent_version`, `consent_source`, `consent_text`, `consented_at`, `opt_out_at`). |

### `V8__donations_payments_and_receipts_schema.sql` (Programmes, Donations, Payments & Receipts)
| Table | Purpose & Key Constraints |
|---|---|
| `donation_programmes` | Seeded strictly with MECT's 5 verified pillars: `EDUCATION_LEARNING`, `WOMEN_EMPOWERMENT`, `SAFE_WATER_SANITATION`, `FOOD_SECURITY_RELIEF`, `COMMUNITY_WELFARE`. |
| `donations` | Authoritative ledger (`donation_reference` unique, `portal_user_id` nullable FK, `programme_id`, `amount`, `currency`, `frequency='ONE_TIME'`, `is_anonymous`, `status`, `confirmed_at`, `@Version`). |
| `payments` | Provider order/QR metadata (`provider`, `provider_order_id`, `provider_qr_id`, `provider_payment_id`, `upi_uri`, `qr_image_url`, `verified_signature_present`, `expires_at`). |
| `payment_events` | Immutable webhook/verification deduplication ledger (`provider_event_id` unique, `signature_verified`, `payload_sha256`, `raw_payload`). |
| `payment_reconciliation_logs` | Append-only state transition audit trail (`previous_status`, `new_status`, `source`, `actor`, `note`). |
| `donation_receipts` | Unique `donation_id` and `receipt_number` (`MECT-RCPT-...`), storing binary `pdf_bytes BYTEA` and `pdf_sha256`. |

### `V9__notification_outbox_schema.sql` (Transactional Outbox & Delivery Audit)
| Table | Purpose & Key Constraints |
|---|---|
| `notification_outbox` | Idempotent event key (`event_key` unique), channel, recipient, sender identity, `attachment_receipt_id`, retry metadata (`retry_count`, `max_retries`, `next_retry_at`). |
| `notification_delivery_logs` | Per-attempt API/webhook trace (`provider`, `provider_message_id`, `delivery_status`, `provider_response`, `webhook_event_id`). |

