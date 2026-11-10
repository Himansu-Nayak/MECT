package org.mahavirtrust.backend.service.payment;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class DynamicQrSvgService {

    public String generateSvg(String payload) {
        if (payload == null || payload.isBlank()) {
            return "";
        }
        try {
            QRCodeWriter writer = new QRCodeWriter();
            BitMatrix matrix = writer.encode(
                    payload,
                    BarcodeFormat.QR_CODE,
                    240,
                    240,
                    Map.of(
                            EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.M,
                            EncodeHintType.MARGIN, 2
                    )
            );
            int width = matrix.getWidth();
            int height = matrix.getHeight();
            StringBuilder svg = new StringBuilder();
            svg.append("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 ")
               .append(width).append(" ").append(height)
               .append("\" role=\"img\" aria-label=\"Dynamic UPI Payment QR Code\">")
               .append("<rect width=\"100%\" height=\"100%\" fill=\"#FFFFFF\"/>")
               .append("<path fill=\"#1D2924\" d=\"");
            for (int y = 0; y < height; y++) {
                for (int x = 0; x < width; x++) {
                    if (matrix.get(x, y)) {
                        svg.append("M").append(x).append(",").append(y).append("h1v1h-1z");
                    }
                }
            }
            svg.append("\"/></svg>");
            return svg.toString();
        } catch (WriterException e) {
            throw new IllegalStateException("Failed to render QR SVG", e);
        }
    }
}

