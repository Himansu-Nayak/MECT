package org.mahavirtrust.backend.service.receipt;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.mahavirtrust.backend.entity.Donation;
import org.mahavirtrust.backend.entity.Payment;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Service
public class ReceiptPdfService {

    private static final Color FOREST = new Color(40, 55, 48);
    private static final Color TERRACOTTA = new Color(164, 94, 68);
    private static final Color CREAM_BG = new Color(243, 228, 210);
    private static final Color INK = new Color(38, 51, 46);
    private static final Color MUTED = new Color(102, 115, 108);

    private static final DateTimeFormatter IST_FORMATTER = DateTimeFormatter
            .ofPattern("dd MMM yyyy, hh:mm a z")
            .withZone(ZoneId.of("Asia/Kolkata"));

    public byte[] generateReceiptPdf(
            String receiptNumber,
            Donation donation,
            Payment payment,
            String donorDisplayName,
            String statutoryNote) {

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 36, 36, 36, 36);
            PdfWriter.getInstance(document, baos);
            document.open();

            // Institutional Header Banner
            PdfPTable header = new PdfPTable(1);
            header.setWidthPercentage(100);
            PdfPCell headerCell = new PdfPCell();
            headerCell.setBackgroundColor(FOREST);
            headerCell.setBorderColorBottom(TERRACOTTA);
            headerCell.setBorderWidthBottom(3f);
            headerCell.setPadding(16f);

            Font orgTitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, Color.WHITE);
            Font subFont = FontFactory.getFont(FontFactory.HELVETICA, 9, CREAM_BG);
            Font badgeFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, new Color(229, 196, 153));

            Paragraph pTitle = new Paragraph("MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)", orgTitleFont);
            Paragraph pSub = new Paragraph(
                    "Near Sai Mandir, Rugudipara, Balangir - 767001, Odisha  |  Contact: +91 94371 23616  |  donations@mect.org.in",
                    subFont
            );
            Paragraph pDoc = new Paragraph(
                    "Registered Public Charitable Trust (Balangir Deed No. 40311302194)  |  Trust PAN: AADTM5474F  |  CSR-1: CSR00081063",
                    badgeFont
            );
            pDoc.setSpacingBefore(6f);

            headerCell.addElement(pTitle);
            headerCell.addElement(pSub);
            headerCell.addElement(pDoc);
            header.addCell(headerCell);
            document.add(header);

            Font sectionTitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13, FOREST);
            Paragraph receiptHeading = new Paragraph("OFFICIAL DONATION RECEIPT & PAYMENT ACKNOWLEDGEMENT", sectionTitleFont);
            receiptHeading.setSpacingBefore(16f);
            receiptHeading.setSpacingAfter(10f);
            document.add(receiptHeading);

            // Key-Value Metadata & Financial Details Table
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{38f, 62f});

            addRow(table, "Receipt Number", receiptNumber);
            addRow(table, "Donation Reference", donation.getDonationReference());
            addRow(table, "Payment Confirmation Date", IST_FORMATTER.format(
                    donation.getConfirmedAt() != null ? donation.getConfirmedAt() : donation.getCreatedAt()));
            addRow(table, "Donor Name", donorDisplayName);
            if (!donation.isAnonymous() && donation.getDonorEmail() != null) {
                addRow(table, "Verified Contact Email", donation.getDonorEmail());
            }
            if (!donation.isAnonymous() && donation.getDonorPan() != null && !donation.getDonorPan().isBlank()) {
                addRow(table, "Donor PAN (Declared)", donation.getDonorPan());
            }
            addRow(table, "Programme / Purpose", donation.getProgramme().getName());
            addRow(table, "Contribution Amount", "INR " + donation.getAmount().toPlainString() + " (" + donation.getCurrency() + ")");
            addRow(table, "Frequency", "ONE-TIME VOLUNTARY CONTRIBUTION");
            addRow(table, "Payment Method", donation.getPaymentMethod());
            addRow(table, "Gateway / Provider", payment.getProvider());
            if (payment.getProviderPaymentId() != null) {
                addRow(table, "Gateway Transaction Reference", payment.getProviderPaymentId());
            }
            if (payment.getProviderOrderId() != null) {
                addRow(table, "Gateway Order Reference", payment.getProviderOrderId());
            }
            addRow(table, "Payment Verification Status", "VERIFIED (" + payment.getStatus() + ")");
            document.add(table);

            // Statutory & Accounting Disclosure
            PdfPTable noteBox = new PdfPTable(1);
            noteBox.setWidthPercentage(100);
            noteBox.setSpacingBefore(16f);
            PdfPCell noteCell = new PdfPCell();
            noteCell.setBackgroundColor(CREAM_BG);
            noteCell.setBorderColor(TERRACOTTA);
            noteCell.setPadding(12f);

            Font noteHeading = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, FOREST);
            Font noteBody = FontFactory.getFont(FontFactory.HELVETICA, 9, INK);
            noteCell.addElement(new Paragraph("Statutory & Accounting Disclosure", noteHeading));
            Paragraph bodyP = new Paragraph(statutoryNote, noteBody);
            bodyP.setSpacingBefore(4f);
            noteCell.addElement(bodyP);
            noteBox.addCell(noteCell);
            document.add(noteBox);

            Font footerFont = FontFactory.getFont(FontFactory.HELVETICA, 8, MUTED);
            Paragraph footer = new Paragraph(
                    "\nComputer-generated official acknowledgement issued by Mahaveer Educational & Charitable Trust (" +
                            receiptNumber + "). Verified record stored in MECT Financial Ledger.",
                    footerFont
            );
            footer.setSpacingBefore(12f);
            document.add(footer);

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new IllegalStateException("Failed to generate PDF receipt for " + receiptNumber, e);
        }
    }

    private void addRow(PdfPTable table, String label, String value) {
        Font labelFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, FOREST);
        Font valFont = FontFactory.getFont(FontFactory.HELVETICA, 10, INK);

        PdfPCell c1 = new PdfPCell(new Phrase(label, labelFont));
        c1.setPadding(8f);
        c1.setBackgroundColor(new Color(248, 243, 236));
        c1.setBorderColor(new Color(221, 212, 199));

        PdfPCell c2 = new PdfPCell(new Phrase(value != null ? value : "-", valFont));
        c2.setPadding(8f);
        c2.setBackgroundColor(Color.WHITE);
        c2.setBorderColor(new Color(221, 212, 199));

        table.addCell(c1);
        table.addCell(c2);
    }
}

