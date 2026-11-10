# MECT — Post-Verification Welcome & Profile Completion Experience Report

## Onboarding & Welcome Architecture
1. **Immediate Post-OTP State (`src/app/portal/login/page.tsx` -> `/portal/welcome`):**
   - Upon OTP verification (`verifyPortalOtp`), newly registered or profile-incomplete supporters see a clear verified confirmation and route to [`src/app/portal/welcome/page.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/portal/welcome/page.tsx).
   - Displays official MECT emblem, account badge (`Community Member` until a verified donation completes), verified contact details, heading **`You're Successfully Verified!`**, supporting line **`Welcome to the MECT community. Your contact information has been verified.`**, and primary **`Complete Your Profile`** button.
2. **Guided 3-Section Profile Completion ([`src/app/portal/profile/page.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/portal/profile/page.tsx)):**
   - **1. Personal Details:** Required Full Name, read-only Verified Email & Verified Phone cards, Preferred Language (`English`, `Hindi`, `Odia`).
   - **2. Address Details:** Required Street/Locality, City, State, PIN Code, and Country.
   - **Progressive Disclosure:** Optional Date of Birth / Optional PAN, secondary verified contact OTP linking, and privacy deletion requests are neatly tucked into expandable panels so non-donors experience zero clutter.
   - **3. Communication Preferences:** Email receipts & impact updates toggles (zero internal `"Resend"` vendor text), plus separate unchecked-by-default WhatsApp opt-in consent.
3. **Personalised Post-Completion Welcome (`/portal/welcome?completed=1`):**
   - Saving an incomplete profile transitions seamlessly to **`Welcome, <FirstName>`** showing verified profile completion status, **`Go to My Dashboard`**, **`Explore Our Programmes`**, and an optional non-pressured **`Make a Donation`** button. Zero fake donation totals or invented impact stats are ever rendered.
4. **Email Registration Welcome Deduplication (`OtpAuthService` + `NotificationOutboxService`):**
   - Tested in `PortalAuthAndOtpSecurityTests.testCentralizedEmailTemplatesAndWelcomeDeduplication`: first registration enqueues `WELCOME_USER:<id>`, while subsequent logins do not send duplicate welcome emails.

