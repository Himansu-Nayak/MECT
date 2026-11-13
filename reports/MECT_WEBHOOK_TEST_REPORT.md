# MECT — Webhook Security & Delivery Automated Test Report

**Execution Date:** 2026-11-11
**Command Run:** `cd backend && mvn test -B`
**Result:** **`Tests run: 47, Failures: 0, Errors: 0, Skipped: 0` (`BUILD SUCCESS`)**

## Phase 12 Scenario Verification Matrix ([`WebhookSecurityAndDeliveryTests`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/backend/src/test/java/org/mahavirtrust/backend/WebhookSecurityAndDeliveryTests.java) & [`DonationPaymentReceiptWorkflowTests`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/backend/src/test/java/org/mahavirtrust/backend/DonationPaymentReceiptWorkflowTests.java))

| # | Scenario | Endpoint / Mechanism Tested | Verified Outcome |
|---|---|---|---|
| 1 | Valid webhook signature | `POST /webhooks/payments/razorpay` (`payment.captured`, `qr_code.credited`) & `POST /webhooks/resend` | Accepted (`HTTP 200`, `PROCESSED` / `RECORDED`) |
| 2 | Invalid signature | `X-Razorpay-Signature: invalid_sig` & bad Svix header | Rejected (`HTTP 401`, logged in `payment_events` / `audit_logs`, 0 receipts) |
| 3 | Missing signature | Both `/webhooks/payments/razorpay` and `/webhooks/resend` without signature headers | Rejected (`HTTP 401`) |
| 4 | Modified payload | Valid signature computed on original payload sent with tampered amount (`150000` -> `999999`) or modified Resend `type` | Rejected (`HTTP 401`) |
| 5 | Expired timestamp | Resend Svix webhook with mathematically valid signature but `svix-timestamp` 900s in the past (`> 300s`) | Rejected (`HTTP 401`, logged warning) |
| 6 | Duplicate event | Replayed Razorpay `evt_qr_101` + same `rfnd_dup_55` across `refund.created` and `refund.processed` + replayed Resend `msg_deliv_1` | Razorpay: `IGNORED_DUPLICATE` / `IGNORED_DUPLICATE_REFUND` (1 receipt, refund not doubled); Resend: `IGNORED` (1 delivery log) |
| 7 | Unknown event | Valid signed `payment.authorized` + non-matching `email_id` | Safely recorded/ignored (`HTTP 200`, `IGNORED`) |
| 8 | Payment success | `qr_code.credited` + `payment.captured` | Transitions `Donation`/`Payment` to `SUCCESSFUL`, issues 1 OpenPDF receipt, grants `ROLE_DONOR`, enqueues email |
| 9 | Payment failure | `payment.failed` | Marks `FAILED`, preserves `0` receipts, enqueues failure email |
| 10 | Refund | `refund.created` / `refund.processed` | Updates `REFUNDED`, preserves historical receipt/ledger, enqueues refund email |
| 11 | Email delivery webhook | `email.delivered` for matching `provider_message_id` | Appends `NotificationDeliveryLog` cleanly |
| 12 | Email bounce webhook | `email.bounced` for matching `provider_message_id` | Appends `NotificationDeliveryLog` and flags `NotificationOutbox.lastError` |
| 13 | Notification retry recovery | Simulated `ResendEmailService` upstream failure -> `RETRY_SCHEDULED` -> `outboxService.dispatchSingleSafe` | Recovers to `SENT` cleanly without failing donation |
| 14 | Database consistency | Checked `Payment`, `Donation`, `DonationReceipt`, `NotificationOutbox`, `NotificationDeliveryLog` counts and totals | Consistent single receipt, exact refunded amount `1500.00` |

## Live Production Edge Route Verification (`https://mect.org.in`)
- Executed unauthenticated `POST` requests against `https://mect.org.in/api/v1/webhooks/resend`, `https://mect.org.in/api/v1/webhooks/payments/razorpay`, and `https://mect.org.in/api/v1/webhooks/whatsapp`: all returned **`HTTP 401 Unauthorized`**.
- **Scope Note:** Local Maven suite ran in Spring `test` profile (`H2` PostgreSQL compatibility mode, sandbox payment generation, simulated signed webhooks) without initiating real Razorpay money movement. Phase 11 local code hardenings await your authorization before pushing to GitHub and redeploying to the VPS.

