package com.jee.clinichub.app.core.sms.hisocial;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.jee.clinichub.app.core.sms.SmsRequest;
import com.jee.clinichub.app.core.sms.SmsService;
import com.jee.clinichub.config.env.EnvironmentProp;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@ConditionalOnProperty(name = "sms.provider", havingValue = "hisocial")
public class HiSocialSmsService implements SmsService {

    @Autowired
    private WebClient webClient;

    @Autowired
    private EnvironmentProp environmentProp;

    @Autowired
    private Environment env;

    @Override
    public void sendSms(SmsRequest smsRequest) {
        try {
            String formattedNumber = formatPhoneNumber(smsRequest.getPhoneNumber());

            if (!isValidPhoneNumber(formattedNumber)) {
                throw new IllegalArgumentException("Invalid phone number after formatting: " + formattedNumber);
            }

            String message = smsRequest.getMessage();
            String encodedMessage = URLEncoder.encode(message, StandardCharsets.UTF_8);

            String url = String.format("%s?number=%s&type=text&message=%s&instance_id=%s&access_token=%s",
                    environmentProp.getHisocialApiUrl(),
                    formattedNumber,
                    message,
                    environmentProp.getHisocialInstanceId(),
                    environmentProp.getHisocialAccessToken());

            if (isProduction()) {
                log.info("Sending SMS with URL: {}", url);
                String response = webClient.get()
                        .uri(url)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();
                log.info("SMS API Response: {}", response);
            } else {
                log.info("[DEV MODE] Simulated SMS to {}: {}", formattedNumber, message);
            }

        } catch (IllegalArgumentException e) {
            log.error("Validation error: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Failed to send SMS: ", e);
            throw new RuntimeException("SMS sending failed", e);
        }
    }

    @Override
    public void sendWhatsapp(SmsRequest smsRequest) {
        try {
            String formattedNumber = formatPhoneNumber(smsRequest.getPhoneNumber());

            if (!isValidPhoneNumber(formattedNumber)) {
                throw new IllegalArgumentException("Invalid phone number after formatting: " + formattedNumber);
            }

            String message = smsRequest.getMessage();
            String encodedMessage = URLEncoder.encode(message, StandardCharsets.UTF_8);

            String url = String.format("%s?number=%s&type=text&message=%s&instance_id=%s&access_token=%s",
                    environmentProp.getHisocialApiUrl(),
                    formattedNumber,
                    message,
                    environmentProp.getHisocialInstanceId(),
                    environmentProp.getHisocialAccessToken());

            if (isProduction()) {
                log.info("Sending WhatsApp message with URL: {}", url);
                String response = webClient.get()
                        .uri(url)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();
                log.info("WhatsApp message sent successfully to {}: {}", formattedNumber, response);
            } else {
                log.info("[DEV MODE] Simulated WhatsApp message to {}: {}", formattedNumber, message);
            }

        } catch (IllegalArgumentException e) {
            log.error("Validation error: {}", e.getMessage());
            throw e;
        } catch (WebClientResponseException e) {
            log.error("Error sending WhatsApp message to {}: Status {}, Response: {}",
                    smsRequest.getPhoneNumber(), e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Failed to send WhatsApp message: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error sending WhatsApp message to {}: {}", smsRequest.getPhoneNumber(), e.getMessage());
            throw new RuntimeException("Failed to send WhatsApp message", e);
        }
    }

    @Override
    public void sendMediaMessage(String phoneNumber, String message, String mediaUrl) {
        try {
            String formattedNumber = formatPhoneNumber(phoneNumber);

            if (!isValidPhoneNumber(formattedNumber)) {
                throw new IllegalArgumentException("Invalid phone number after formatting: " + formattedNumber);
            }

            String encodedMessage = URLEncoder.encode(message, StandardCharsets.UTF_8);
            String encodedMediaUrl = URLEncoder.encode(mediaUrl, StandardCharsets.UTF_8);

            String url = String.format("%s?number=%s&type=media&message=%s&media_url=%s&instance_id=%s&access_token=%s",
                    environmentProp.getHisocialApiUrl(),
                    formattedNumber,
                    message,
                    mediaUrl,
                    environmentProp.getHisocialInstanceId(),
                    environmentProp.getHisocialAccessToken());

            if (isProduction()) {
                log.info("Sending WhatsApp media message with URL: {}", url);
                String response = webClient.get()
                        .uri(url)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();
                log.info("Media message sent successfully to {}: {}", formattedNumber, response);
            } else {
                log.info("[DEV MODE] Simulated media message to {}: {}, media: {}", formattedNumber, message, mediaUrl);
            }

        } catch (IllegalArgumentException e) {
            log.error("Validation error: {}", e.getMessage());
            throw e;
        } catch (WebClientResponseException e) {
            log.error("Error sending media message to {}: Status {}, Response: {}",
                    phoneNumber, e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Failed to send media message: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error sending media message to {}: {}", phoneNumber, e.getMessage());
            throw new RuntimeException("Failed to send media message", e);
        }
    }

    private String formatPhoneNumber(String rawNumber) {
        if (rawNumber == null || rawNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Phone number cannot be empty");
        }
        String cleaned = rawNumber.trim().replaceAll("[\\s\\-()]", "");
        if (cleaned.startsWith("+")) {
            cleaned = cleaned.substring(1);
        }
        if (cleaned.length() == 10) {
            cleaned = "91" + cleaned;
        }
        return cleaned;
    }

    private boolean isValidPhoneNumber(String number) {
        return number != null && number.matches("^91\\d{10}$");
    }

    private boolean isProduction() {
        return Arrays.asList(env.getActiveProfiles()).contains("prod");
    }
}
