
package com.jee.clinichub.app.core.qrcode;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import javax.imageio.ImageIO;

import org.springframework.stereotype.Component;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class QRCodeGenerator {

    private static final int QR_CODE_SIZE = 200;
    private static final String IMAGE_FORMAT = "PNG";

    

    /**
     * Generate QR code image and return as Base64 string
     */
    public String generateQRCodeImage(String content) throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        
        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.M);
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
        
        BitMatrix bitMatrix = qrCodeWriter.encode(content, BarcodeFormat.QR_CODE, QR_CODE_SIZE, QR_CODE_SIZE, hints);
        
        BufferedImage bufferedImage = new BufferedImage(QR_CODE_SIZE, QR_CODE_SIZE, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = bufferedImage.createGraphics();
        
        // Set background to white
        graphics.setColor(Color.WHITE);
        graphics.fillRect(0, 0, QR_CODE_SIZE, QR_CODE_SIZE);
        
        // Set QR code color to black
        graphics.setColor(Color.BLACK);
        
        for (int x = 0; x < QR_CODE_SIZE; x++) {
            for (int y = 0; y < QR_CODE_SIZE; y++) {
                if (bitMatrix.get(x, y)) {
                    graphics.fillRect(x, y, 1, 1);
                }
            }
        }
        
        graphics.dispose();
        
        // Convert to Base64
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage, IMAGE_FORMAT, outputStream);
        byte[] imageBytes = outputStream.toByteArray();
        
        return Base64.getEncoder().encodeToString(imageBytes);
    }

    /**
     * Generate fallback QR code with simple text
     */
    public String generateFallbackQRCode(String text) {
        try {
            return generateQRCodeImage(text);
        } catch (Exception e) {
            log.error("Error generating fallback QR code: {}", e.getMessage());
            return null;
        }
    }
}
