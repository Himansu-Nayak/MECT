package org.mahavirtrust.backend.service.notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.util.HtmlUtils;

@Component
public class EmailTemplateRenderer {

  private final String publicBaseUrl;

  public EmailTemplateRenderer() {
    this("https://mect.org.in");
  }

  @Autowired
  public EmailTemplateRenderer(@Value("${app.resend.public-base-url:https://mect.org.in}") String publicBaseUrl) {
    String normalized = (publicBaseUrl == null || publicBaseUrl.isBlank()) ? "https://mect.org.in"
        : publicBaseUrl.trim();
    this.publicBaseUrl = normalized.endsWith("/") ? normalized.substring(0, normalized.length() - 1) : normalized;
  }

  public record RenderedEmail(String subject, String htmlBody, String templateVersion) {
  }

  public RenderedEmail renderOtpEmail(String otpCode, int expiryMinutes, String purposeLabel) {
    String safeCode = HtmlUtils.htmlEscape(otpCode);
    boolean isContactChange = "Contact Verification".equalsIgnoreCase(purposeLabel);
    String subject = isContactChange ? "Verify Your New MECT Contact" : "Your MECT Verification Code";
    String heading = isContactChange ? "Verify Your New Contact" : "Verify Your Email Address";

    String content = """
        <p style="margin:0 0 14px 0;color:#26332E;font-size:15px;line-height:1.65;">
          Hello,
        </p>
        <p style="margin:0 0 18px 0;color:#26332E;font-size:15px;line-height:1.65;">
          Thank you for connecting with Mahaveer Educational &amp; Charitable Trust.
        </p>
        <p style="margin:0 0 20px 0;color:#26332E;font-size:15px;line-height:1.65;">
          Use the verification code below to securely continue to your account.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%%" style="margin:0 0 22px 0;background-color:#F3E4D2;border:1px solid #E5C499;border-top:3px solid #A45E44;">
          <tr>
            <td align="center" style="padding:24px 16px;">
              <div style="font-size:11px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:#874A35;margin:0 0 10px 0;">
                One-Time Verification Code
              </div>
              <div style="font-family:'Courier New',Courier,monospace;font-size:34px;font-weight:700;letter-spacing:10px;color:#1D2924;line-height:1.2;">
                %s
              </div>
              <div style="margin:12px 0 0 0;font-size:12px;color:#66736C;">
                Valid for %d minutes &bull; Single-use security code
              </div>
            </td>
          </tr>
        </table>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%%" style="background-color:#F0DEC5;border-left:3px solid #283730;">
          <tr>
            <td style="padding:12px 14px;font-size:13px;line-height:1.55;color:#26332E;">
              Your verification code is valid for %d minutes. Do not share this code with anyone. MECT staff will never request this code by phone, email, or WhatsApp.
            </td>
          </tr>
        </table>
        """
        .formatted(safeCode, expiryMinutes, expiryMinutes);

    return new RenderedEmail(
        subject,
        wrapLayout(heading, "Passwordless Account Verification", content, true),
        "otp-v2.0");
  }

  public RenderedEmail renderWelcomeEmail(String firstName) {
    String name = safeFirstName(firstName);
    String subject = "Welcome to the MECT Community";
    String dashboardUrl = publicBaseUrl + "/portal/dashboard";
    String programmesUrl = publicBaseUrl + "/programmes";

    String content = """
        <p style="margin:0 0 16px 0;color:#26332E;font-size:15px;line-height:1.65;">
          We're pleased to welcome you to the Mahaveer Educational &amp; Charitable Trust community.
        </p>
        <p style="margin:0 0 16px 0;color:#26332E;font-size:15px;line-height:1.65;">
          Your account has been successfully created and your contact details have been verified.
        </p>
        <p style="margin:0 0 22px 0;color:#26332E;font-size:15px;line-height:1.65;">
          Through this account, you can manage your profile, explore MECT's programmes and access your donation records whenever you choose to support our work.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%%" style="margin:0 0 22px 0;background-color:#F3E4D2;border:1px solid #E5C499;">
          <tr>
            <td style="padding:18px 20px;">
              <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:#874A35;margin:0 0 8px 0;">
                Your MECT Portal Access
              </div>
              <p style="margin:0 0 14px 0;font-size:13px;color:#26332E;line-height:1.55;">
                Complete your personal details or explore our five verified social-sector pillars across Balangir and Odisha.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" bgcolor="#A45E44" style="border-radius:3px;">
                    <a href="%s" style="display:inline-block;padding:12px 22px;font-size:13px;font-weight:700;color:#FFFFFF;text-decoration:none;font-family:Arial,sans-serif;">
                      Go to My Dashboard
                    </a>
                  </td>
                  <td width="12"></td>
                  <td align="center" style="border:1px solid #283730;border-radius:3px;">
                    <a href="%s" style="display:inline-block;padding:11px 18px;font-size:13px;font-weight:600;color:#283730;text-decoration:none;font-family:Arial,sans-serif;">
                      Explore Programmes
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <p style="margin:0;color:#26332E;font-size:14px;line-height:1.6;">
          Thank you for connecting with MECT.
        </p>
        """
        .formatted(HtmlUtils.htmlEscape(dashboardUrl), HtmlUtils.htmlEscape(programmesUrl));

    return new RenderedEmail(
        subject,
        wrapLayout("Welcome, " + name + "!", "Registered Supporter Account Ready", content, true),
        "welcome-v2.0");
  }

  public RenderedEmail renderProfileCompletedEmail(String firstName) {
    String name = safeFirstName(firstName);
    String subject = "Your MECT Profile Details Are Saved";
    String dashboardUrl = publicBaseUrl + "/portal/dashboard";

    String content = """
        <p style="margin:0 0 14px 0;color:#26332E;font-size:15px;line-height:1.65;">
          Hello %s,
        </p>
        <p style="margin:0 0 16px 0;color:#26332E;font-size:15px;line-height:1.65;">
          Your Mahaveer Educational &amp; Charitable Trust profile has been updated and verified. Your contact details, address records, and communication preferences are now saved to your account.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px 0;">
          <tr>
            <td align="center" bgcolor="#283730" style="border-radius:3px;">
              <a href="%s" style="display:inline-block;padding:12px 22px;font-size:13px;font-weight:700;color:#FFFFFF;text-decoration:none;font-family:Arial,sans-serif;">
                Open My Dashboard
              </a>
            </td>
          </tr>
        </table>
        <p style="margin:0;color:#66736C;font-size:13px;line-height:1.6;">
          You can update your profile or notification consent preferences at any time from your portal settings.
        </p>
        """
        .formatted(name, HtmlUtils.htmlEscape(dashboardUrl));

    return new RenderedEmail(
        subject,
        wrapLayout("Profile Updated", "Supporter Record Confirmed", content, true),
        "profile-v2.0");
  }

  public RenderedEmail renderDonationInitiatedEmail(String firstName, String amountText, String programme,
      String reference) {
    String subject = "Your MECT Donation Request";
    String content = """
        <p style="margin:0 0 14px 0;color:#26332E;font-size:15px;line-height:1.65;">
          Hello %s,
        </p>
        <p style="margin:0 0 16px 0;color:#26332E;font-size:15px;line-height:1.65;">
          Your voluntary contribution request of <strong>%s</strong> towards <strong>%s</strong> has been initiated and is currently awaiting verified payment confirmation.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%%" style="margin:0 0 18px 0;background-color:#F3E4D2;border-left:4px solid #A45E44;">
          <tr>
            <td style="padding:14px 16px;font-size:13px;color:#26332E;line-height:1.6;">
              <div><strong>Reference:</strong> <span style="font-family:monospace;">%s</span></div>
              <div><strong>Programme:</strong> %s</div>
              <div><strong>Amount:</strong> %s</div>
              <div><strong>Status:</strong> Pending Payment Settlement</div>
            </td>
          </tr>
        </table>
        <p style="margin:0;color:#66736C;font-size:13px;line-height:1.6;">
          Your official PDF payment receipt will be generated automatically once the transaction is settled and verified server-side.
        </p>
        """
        .formatted(
            safeFirstName(firstName),
            HtmlUtils.htmlEscape(amountText),
            HtmlUtils.htmlEscape(programme),
            HtmlUtils.htmlEscape(reference),
            HtmlUtils.htmlEscape(programme),
            HtmlUtils.htmlEscape(amountText));

    return new RenderedEmail(
        subject,
        wrapLayout("Donation Pending Verification", "Awaiting Payment Gateway Settlement", content, true),
        "don-init-v2.0");
  }

  public RenderedEmail renderDonationConfirmedReceiptEmail(
      String firstName,
      String amountText,
      String programme,
      String donationRef,
      String receiptNumber,
      String portalUrl) {
    String subject = "Thank You for Your Donation to MECT";
    String safePortal = (portalUrl == null || portalUrl.isBlank()) ? (publicBaseUrl + "/portal/dashboard") : portalUrl;

    String content = """
        <p style="margin:0 0 14px 0;color:#26332E;font-size:15px;line-height:1.65;">
          Hello %s,
        </p>
        <p style="margin:0 0 18px 0;color:#26332E;font-size:15px;line-height:1.65;">
          Your contribution of <strong>%s</strong> towards <strong>%s</strong> has been verified. Your official PDF payment receipt (<strong>%s</strong>) is attached to this message.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%%" style="margin:0 0 20px 0;background-color:#F3E4D2;border-left:4px solid #A45E44;">
          <tr>
            <td style="padding:14px 16px;font-size:13px;color:#26332E;line-height:1.65;">
              <div><strong>Receipt Number:</strong> %s</div>
              <div><strong>Donation Reference:</strong> %s</div>
              <div><strong>Programme:</strong> %s</div>
              <div><strong>Amount Verified:</strong> %s</div>
            </td>
          </tr>
        </table>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px 0;">
          <tr>
            <td align="center" bgcolor="#283730" style="border-radius:3px;">
              <a href="%s" style="display:inline-block;padding:12px 22px;font-size:13px;font-weight:700;color:#FFFFFF;text-decoration:none;font-family:Arial,sans-serif;">
                View Ledger &amp; Receipts
              </a>
            </td>
          </tr>
        </table>
        <p style="margin:0;color:#66736C;font-size:12px;line-height:1.55;">
          Factual Notice: This acknowledgement confirms verified receipt of funds by Mahaveer Educational &amp; Charitable Trust (Balangir Trust Deed No. 40311302194; PAN AADTM5474F). Please refer to your attached receipt for full accounting disclosures.
        </p>
        """
        .formatted(
            safeFirstName(firstName),
            HtmlUtils.htmlEscape(amountText),
            HtmlUtils.htmlEscape(programme),
            HtmlUtils.htmlEscape(receiptNumber),
            HtmlUtils.htmlEscape(receiptNumber),
            HtmlUtils.htmlEscape(donationRef),
            HtmlUtils.htmlEscape(programme),
            HtmlUtils.htmlEscape(amountText),
            HtmlUtils.htmlEscape(safePortal));

    return new RenderedEmail(
        subject,
        wrapLayout("Official Donation Receipt", "Verified Contribution Acknowledgement", content, true),
        "don-rcpt-v2.0");
  }

  public RenderedEmail renderDonationFailedEmail(String firstName, String amountText, String programme,
      String reference, String reason) {
    String subject = "MECT Payment Update — Ref " + HtmlUtils.htmlEscape(reference);
    String donateUrl = publicBaseUrl + "/donate";

    String content = """
        <p style="margin:0 0 14px 0;color:#26332E;font-size:15px;line-height:1.65;">
          Hello %s,
        </p>
        <p style="margin:0 0 16px 0;color:#26332E;font-size:15px;line-height:1.65;">
          Your payment attempt of <strong>%s</strong> towards <strong>%s</strong> (Reference: <span style="font-family:monospace;">%s</span>) was not completed (%s). No official donation receipt was issued.
        </p>
        <p style="margin:0 0 18px 0;color:#66736C;font-size:13px;line-height:1.6;">
          If any amount was debited by your bank, standard inter-bank reversals typically credit automatically within 5–7 working days. You may retry safely or use direct SBI institutional remittance on our website.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" bgcolor="#A45E44" style="border-radius:3px;">
              <a href="%s" style="display:inline-block;padding:11px 20px;font-size:13px;font-weight:700;color:#FFFFFF;text-decoration:none;font-family:Arial,sans-serif;">
                Return to Donation Options
              </a>
            </td>
          </tr>
        </table>
        """
        .formatted(
            safeFirstName(firstName),
            HtmlUtils.htmlEscape(amountText),
            HtmlUtils.htmlEscape(programme),
            HtmlUtils.htmlEscape(reference),
            HtmlUtils.htmlEscape(reason != null && !reason.isBlank() ? reason : "Payment not completed"),
            HtmlUtils.htmlEscape(donateUrl));

    return new RenderedEmail(
        subject,
        wrapLayout("Payment Not Completed", "Transaction Update", content, true),
        "don-fail-v2.0");
  }

  public RenderedEmail renderRefundEmail(String firstName, String amountText, String reference) {
    String subject = "MECT Refund Recorded — Ref " + HtmlUtils.htmlEscape(reference);
    String content = """
        <p style="margin:0 0 14px 0;color:#26332E;font-size:15px;line-height:1.65;">
          Hello %s,
        </p>
        <p style="margin:0 0 16px 0;color:#26332E;font-size:15px;line-height:1.65;">
          A refund of <strong>%s</strong> associated with donation reference <span style="font-family:monospace;">%s</span> has been recorded by our payment gateway and reflected on your MECT supporter ledger.
        </p>
        <p style="margin:0;color:#66736C;font-size:13px;line-height:1.6;">
          If you need any assistance tracing this refund with your issuing bank, please contact MECT support with your reference ID.
        </p>
        """
        .formatted(
            safeFirstName(firstName),
            HtmlUtils.htmlEscape(amountText),
            HtmlUtils.htmlEscape(reference));

    return new RenderedEmail(
        subject,
        wrapLayout("Refund Confirmation", "Ledger Adjustment Notice", content, true),
        "don-refund-v2.0");
  }

  public RenderedEmail renderSecurityNoticeEmail(String firstName, String noticeDetail) {
    String subject = "MECT Account Security Notification";
    String content = """
        <p style="margin:0 0 14px 0;color:#26332E;font-size:15px;line-height:1.65;">
          Hello %s,
        </p>
        <p style="margin:0 0 16px 0;color:#26332E;font-size:15px;line-height:1.65;">
          %s
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%%" style="background-color:#F0DEC5;border-left:3px solid #A45E44;">
          <tr>
            <td style="padding:12px 14px;font-size:13px;line-height:1.55;color:#26332E;">
              If you did not authorise this change, please contact Mahaveer Educational &amp; Charitable Trust immediately at mect220@gmail.com or +91 94382 95223.
            </td>
          </tr>
        </table>
        """
        .formatted(safeFirstName(firstName), HtmlUtils.htmlEscape(noticeDetail));

    return new RenderedEmail(
        subject,
        wrapLayout("Account Security Notice", "Contact & Access Update", content, true),
        "sec-v2.0");
  }

  public RenderedEmail renderLoginNotificationEmail(String firstName, String clientIp, String loginTime) {
    String subject = "New Sign-In to Your MECT Account";
    String content = """
        <p style="margin:0 0 14px 0;color:#26332E;font-size:15px;line-height:1.65;">
          Hello %s,
        </p>
        <p style="margin:0 0 16px 0;color:#26332E;font-size:15px;line-height:1.65;">
          A new sign-in to your Mahaveer Educational &amp; Charitable Trust donor account was detected.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%%" style="margin:0 0 18px 0;background-color:#F3E4D2;border-left:4px solid #283730;">
          <tr>
            <td style="padding:14px 16px;font-size:13px;color:#26332E;line-height:1.6;">
              <div><strong>Time:</strong> %s</div>
              <div><strong>IP Address:</strong> %s</div>
            </td>
          </tr>
        </table>
        <p style="margin:0;color:#66736C;font-size:13px;line-height:1.6;">
          If this was you, no action is required. If you did not sign in, please contact our secretariat immediately at mect220@gmail.com or +91 94382 95223.
        </p>
        """
        .formatted(safeFirstName(firstName), HtmlUtils.htmlEscape(loginTime), HtmlUtils.htmlEscape(clientIp));

    return new RenderedEmail(
        subject,
        wrapLayout("New Sign-In Detected", "Account Security Notification", content, true),
        "login-notice-v1.0");
  }

  public RenderedEmail renderDirectBankTransferSubmittedEmail(
      String firstName,
      String amountText,
      String programme,
      String donationRef,
      String maskedUtr) {
    String subject = "Your MECT Bank / UPI Transfer Has Been Submitted";
    String content = """
        <p style="margin:0 0 14px 0;color:#26332E;font-size:15px;line-height:1.65;">
          Hello %s,
        </p>
        <p style="margin:0 0 16px 0;color:#26332E;font-size:15px;line-height:1.65;">
          Thank you for submitting your direct bank / UPI transfer details. Your transfer reference has been recorded and is currently in the status <strong>PENDING_VERIFICATION</strong>.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%%" style="margin:0 0 18px 0;background-color:#F3E4D2;border-left:4px solid #A45E44;">
          <tr>
            <td style="padding:14px 16px;font-size:13px;color:#26332E;line-height:1.6;">
              <div><strong>Donation Reference:</strong> %s</div>
              <div><strong>Programme:</strong> %s</div>
              <div><strong>Claimed Amount:</strong> %s</div>
              <div><strong>Transfer Reference (UTR):</strong> %s</div>
              <div><strong>Status:</strong> PENDING_VERIFICATION</div>
            </td>
          </tr>
        </table>
        <p style="margin:0 0 14px 0;color:#66736C;font-size:13px;line-height:1.6;">
          <strong>Notice:</strong> This is an acknowledgement of your submission. Verification is currently pending manual ledger reconciliation against the official State Bank of India bank statement. Your official numbered PDF receipt will be issued upon approval.
        </p>
        """
        .formatted(
            safeFirstName(firstName),
            HtmlUtils.htmlEscape(donationRef),
            HtmlUtils.htmlEscape(programme),
            HtmlUtils.htmlEscape(amountText),
            HtmlUtils.htmlEscape(maskedUtr));

    return new RenderedEmail(
        subject,
        wrapLayout("Transfer Claim Received", "Pending Bank Reconciliation", content, true),
        "bank-submitted-v1.0");
  }

  public RenderedEmail renderDirectBankTransferVerifiedEmail(
      String firstName,
      String amountText,
      String programme,
      String donationRef,
      String receiptNumber,
      String portalUrl) {
    String subject = "Your MECT Donation Has Been Verified";
    String safePortal = (portalUrl == null || portalUrl.isBlank()) ? (publicBaseUrl + "/portal/dashboard") : portalUrl;

    String content = """
        <p style="margin:0 0 14px 0;color:#26332E;font-size:15px;line-height:1.65;">
          Hello %s,
        </p>
        <p style="margin:0 0 18px 0;color:#26332E;font-size:15px;line-height:1.65;">
          We are pleased to inform you that your direct bank / UPI transfer of <strong>%s</strong> towards <strong>%s</strong> has been verified by the Trust secretariat. Your official donation receipt (<strong>%s</strong>) is attached.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%%" style="margin:0 0 20px 0;background-color:#F3E4D2;border-left:4px solid #283730;">
          <tr>
            <td style="padding:14px 16px;font-size:13px;color:#26332E;line-height:1.65;">
              <div><strong>Receipt Number:</strong> %s</div>
              <div><strong>Donation Reference:</strong> %s</div>
              <div><strong>Programme:</strong> %s</div>
              <div><strong>Verified Amount:</strong> %s</div>
              <div><strong>Status:</strong> VERIFIED &amp; CONFIRMED</div>
            </td>
          </tr>
        </table>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px 0;">
          <tr>
            <td align="center" bgcolor="#283730" style="border-radius:3px;">
              <a href="%s" style="display:inline-block;padding:12px 22px;font-size:13px;font-weight:700;color:#FFFFFF;text-decoration:none;font-family:Arial,sans-serif;">
                Access Donor Portal
              </a>
            </td>
          </tr>
        </table>
        <p style="margin:0;color:#66736C;font-size:12px;line-height:1.55;">
          Thank you for supporting Mahaveer Educational &amp; Charitable Trust's charitable work across Odisha.
        </p>
        """
        .formatted(
            safeFirstName(firstName),
            HtmlUtils.htmlEscape(amountText),
            HtmlUtils.htmlEscape(programme),
            HtmlUtils.htmlEscape(receiptNumber),
            HtmlUtils.htmlEscape(receiptNumber),
            HtmlUtils.htmlEscape(donationRef),
            HtmlUtils.htmlEscape(programme),
            HtmlUtils.htmlEscape(amountText),
            HtmlUtils.htmlEscape(safePortal));

    return new RenderedEmail(
        subject,
        wrapLayout("Transfer Verified", "Official Receipt Issued", content, true),
        "bank-verified-v1.0");
  }

  public RenderedEmail renderClaimRejectedEmail(
      String firstName,
      String donationRef,
      String utrNumber,
      String reason) {
    String subject = "Update on Your MECT Transfer Claim";
    String content = """
        <p style="margin:0 0 14px 0;color:#26332E;font-size:15px;line-height:1.65;">
          Hello %s,
        </p>
        <p style="margin:0 0 16px 0;color:#26332E;font-size:15px;line-height:1.65;">
          We are writing to provide an update regarding your transfer verification claim for donation reference <strong>%s</strong> (UTR: %s).
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%%" style="margin:0 0 18px 0;background-color:#F3E4D2;border-left:4px solid #A45E44;">
          <tr>
            <td style="padding:14px 16px;font-size:13px;color:#26332E;line-height:1.6;">
              <div><strong>Status:</strong> Verification Unsuccessful / Rejected</div>
              <div><strong>Feedback / Next Steps:</strong> %s</div>
            </td>
          </tr>
        </table>
        <p style="margin:0;color:#66736C;font-size:13px;line-height:1.6;">
          If you believe this decision was made in error or have updated bank proof, please contact the Trust Secretariat at mect220@gmail.com or +91 94382 95223.
        </p>
        """
        .formatted(
            safeFirstName(firstName),
            HtmlUtils.htmlEscape(donationRef),
            HtmlUtils.htmlEscape(utrNumber),
            HtmlUtils.htmlEscape(reason != null && !reason.isBlank() ? reason : "Transaction could not be matched against current bank credit records."));

    return new RenderedEmail(
        subject,
        wrapLayout("Transfer Claim Update", "Reconciliation Notice", content, true),
        "claim-rejected-v1.0");
  }

  private String safeFirstName(String fullName) {
    if (fullName == null || fullName.isBlank()) {
      return "Supporter";
    }
    String first = fullName.trim().split("\\s+")[0];
    return HtmlUtils.htmlEscape(first);
  }

  private String wrapLayout(String title, String eyebrow, String bodyHtml, boolean automatedNotice) {
    String emblemUrl = publicBaseUrl + "/images/mect-official-emblem.png";
    String autoText = automatedNotice
        ? "<div style=\"margin-top:8px;color:#66736C;font-size:11px;\">This is an automated message from Mahaveer Educational &amp; Charitable Trust. Please do not share one-time codes with anyone.</div>"
        : "";

    return """
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>%s</title>
        </head>
        <body style="margin:0;padding:0;background-color:#F3E4D2;-webkit-text-size-adjust:100%%;-ms-text-size-adjust:100%%;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%%" style="background-color:#F3E4D2;padding:24px 12px;">
            <tr>
              <td align="center">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%%;background-color:#FFFFFF;border:1px solid #DDD4C7;border-collapse:collapse;">
                  <tr>
                    <td style="background-color:#283730;padding:20px 24px;border-bottom:4px solid #A45E44;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%%">
                        <tr>
                          <td width="56" valign="middle" style="padding-right:14px;">
                            <img src="%s" width="46" height="46" alt="MECT Emblem" style="display:block;width:46px;height:46px;border-radius:50%%;border:2px solid #E5C499;background-color:#FFFFFF;" />
                          </td>
                          <td valign="middle">
                            <div style="font-size:11px;letter-spacing:1.3px;text-transform:uppercase;color:#E5C499;font-weight:700;line-height:1.3;">
                              Mahaveer Educational &amp; Charitable Trust
                            </div>
                            <div style="font-size:11px;color:#D2D6C8;margin-top:2px;">
                              %s
                            </div>
                          </td>
                        </tr>
                      </table>
                      <h1 style="margin:16px 0 0 0;font-size:22px;line-height:1.3;color:#FFFFFF;font-family:Georgia,'Times New Roman',serif;font-weight:700;">
                        %s
                      </h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:26px 24px;background-color:#FFFFFF;">
                      %s
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 24px;background-color:#F0DEC5;border-top:1px solid #E5C499;font-size:12px;line-height:1.6;color:#26332E;">
                      <div style="font-weight:700;color:#1D2924;">Mahaveer Educational &amp; Charitable Trust (MECT)</div>
                      <div style="color:#66736C;">Near Sai Mandir, Rugudipara, Balangir &ndash; 767001, Odisha, India</div>
                      <div style="color:#66736C;margin-top:4px;">
                        Website: <a href="%s" style="color:#874A35;text-decoration:underline;">%s</a>
                        &bull; Email: <a href="mailto:mect220@gmail.com" style="color:#874A35;text-decoration:underline;">mect220@gmail.com</a>
                        &bull; Phone: +91 94382 95223
                      </div>
                      %s
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        """
        .formatted(
            HtmlUtils.htmlEscape(title),
            HtmlUtils.htmlEscape(emblemUrl),
            HtmlUtils.htmlEscape(eyebrow),
            HtmlUtils.htmlEscape(title),
            bodyHtml,
            HtmlUtils.htmlEscape(publicBaseUrl),
            HtmlUtils.htmlEscape(publicBaseUrl),
            autoText);
  }
}
