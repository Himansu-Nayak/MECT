# MECT — Webhook Security Audit Report

## Security Control Assessment Across Implemented Endpoints

| Control | Razorpay (`/webhooks/payments/razorpay`) | Resend (`/webhooks/resend`) | WhatsApp (`/webhooks/whatsapp`) |
|---|---|---|---|
| **1. Signature Algorithm** | Constant-time hex HMAC-SHA256 (`X-Razorpay-Signature`) via `HmacCryptoUtil.verifyHmacSha256Hex` | Constant-time Base64 Svix HMAC-SHA256 (`svix-signature` `v1,...`) | Constant-time hex HMAC-SHA256 (`X-Hub-Signature-256`, `sha256=...`) |
| **2. Raw Body Integrity** | `@RequestBody String rawPayload` verified before Jackson JSON parsing | `@RequestBody String rawPayload` verified before Jackson JSON parsing | `@RequestBody String rawPayload` verified before Jackson JSON parsing |
| **3. Timestamp / Replay Protection** | `payment_events.provider_event_id` (`X-Razorpay-Event-Id` / SHA-256 hash) rejects replays permanently via unique DB constraint | **Hardened locally:** enforces `±300s` Svix `svix-timestamp` tolerance window + `svix-id` dedup (`notification_delivery_logs.webhook_event_id`) | Verifies `X-Hub-Signature-256`; **hardened locally** with per-status `msgId:status` `webhook_event_id` dedup |
| **4. Idempotent Accounting** | Double check: `existsByProviderEventId` + `SUCCESSFUL && receipt exists` guard + **new `REFUND_REF:<refundId>` guard** prevents duplicate receipts, duplicate emails, or double refund totals | `existsByWebhookEventId` prevents duplicate `NotificationDeliveryLog` entries on Svix retries | `existsByWebhookEventId` prevents duplicate status log entries |
| **5. Rate Limiting** | Public `/public/` & `/portal/auth/` throttled; `/webhooks/**` exempt so legitimate bursts succeed while invalid traffic fails early (`401`) | Same | Same |
| **6. Payload & PII Logging** | Rejections log metadata & event ID to `audit_logs` and raw payload inside restricted admin DB `payment_events`; never prints secrets or leaks stack traces | Logs only sanitized event status / category; webhook secret (`whsec_...`) never logged | Logs status metadata only; `appSecret` never logged |
| **7. Frontend Exposure** | Zero webhook secrets or provider API secrets in Next.js bundles (`NEXT_PUBLIC_*` contains URL only) | Same | Same |
| **8. Transaction Consistency** | All confirmation state (`Payment`, `Donation`, `PaymentEvent`, `DonationReceipt`, `PortalUserRole`, `NotificationOutbox`) executes inside `@Transactional` | `recordWebhookDeliveryUpdate` runs inside `@Transactional` | Same |

## Gap Identified Between Local Repository & Currently Running VPS Build
- The live VPS currently runs commit `e4ae497` (deployed cleanly for OTP & email redesign). The three Phase 11 webhook hardenings (`±300s` Svix timestamp check, `svix-id`/`msgId:status` delivery-log deduplication, and `REFUND_REF:` multi-refund deduplication) are implemented and tested locally (**`47/47` tests PASS**) and were intentionally **not pushed/deployed** per your explicit instruction (`"Do not push to GitHub or deploy to VPS as part of this task"`).

