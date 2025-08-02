package com.jee.clinichub.app.user.otp.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.jee.clinichub.app.core.mail.MailRequest;
import com.jee.clinichub.app.core.mail.MailService;
import com.jee.clinichub.app.core.sms.SmsRequest;
import com.jee.clinichub.app.core.sms.SmsService;
import com.jee.clinichub.app.user.model.User;
import com.jee.clinichub.app.user.model.UserDto;
import com.jee.clinichub.app.user.otp.model.Otp;
import com.jee.clinichub.app.user.otp.repository.OtpRepository;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService{

	private static final String OTP_TEMPLATE =
		    "*{{1}}* is your verification code for ClinicHub.Care.\n\n" +
		    "🔒 Expires in 10 minutes — do not share it with anyone.";
	
	private static final int OTP_LENGTH = 6;
    private static final String OTP_EMAIL_SUBJECT = "Your OTP Code";

    private static final long OTP_EXPIRATION_MINUTES = 5;
    private static final int MAX_ATTEMPTS = 5;
    private static final int SESSION_ID_LENGTH = 16;

    private final MailService mailService;
    private final OtpRepository otpRepository;
    private final SecureRandom secureRandom = new SecureRandom();
    private final SmsService smsService;

    private final TemplateEngine templateEngine;

	@Value("${mail.from}")
    private String fromEmail;

    public String generateOTP() {
        return String.format("%0" + OTP_LENGTH + "d", secureRandom.nextInt((int) Math.pow(10, OTP_LENGTH)));
    }
    
    public String buildOtpMessage(String otp) {
        return OTP_TEMPLATE.replace("{{1}}", otp);
    }

	public String generateSessionId() {
        byte[] randomBytes = new byte[SESSION_ID_LENGTH];
        secureRandom.nextBytes(randomBytes);
        StringBuilder sessionId = new StringBuilder();
        for (byte b : randomBytes) {
            sessionId.append(String.format("%02x", b));
        }
        return sessionId.toString();
    }

	@Override
    public String sendOTP(User user,String reason) {
        String otp = generateOTP();
        String session = generateSessionId();
        LocalDateTime expiryTime = LocalDateTime.now().plus(OTP_EXPIRATION_MINUTES, ChronoUnit.MINUTES);

        Otp otpEntity = new Otp();
        if (user.getId() != null) {
            otpEntity.setUserId(user.getId());
        } else {
            otpEntity.setEmailOrMobile(user.getEmail() != null ? user.getEmail() : user.getPhone());
        }
        otpEntity.setSession(session);
        otpEntity.setOtp(otp);
        otpEntity.setReason(reason);
        otpEntity.setExpiryTime(expiryTime);
        otpEntity.setCreatedTime(LocalDateTime.now());
        otpEntity.setUsed(false);
        otpEntity.setAttempts(0); // Initialize attempts to 0
        otpRepository.save(otpEntity);

        // Implement SMS sending logic here
        // For demonstration, we'll use email
        if(user.getPhone()!=null) {
        	String message = this.buildOtpMessage(otp);
        	smsService.sendSms(new SmsRequest(user.getPhone(), message));
        	log.info("OTP sent to user via whatsapp {}: {}",  otpEntity.getEmailOrMobile(), otp);
        }
        
        if (isValidEmail(user.getEmail())) {
         //   String emailBody = String.format(OTP_EMAIL_BODY_TEMPLATE, otp);
         Context context = new Context();
         context.setVariable("otp", otp);
 
         String emailBody = templateEngine.process("otp-email-template", context);
 
            MailRequest mailRequest = new MailRequest(this, fromEmail, user.getEmail(), OTP_EMAIL_SUBJECT, emailBody);
            mailService.sendMail(mailRequest);
            log.info("OTP sent to user via Email {}: {}", otpEntity.getEmailOrMobile(), otp);
        }
        
       
        return session;
    }
	
	private boolean isValidEmail(String email) {
	    if (email == null || email.isBlank()) return false;

	    String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
	    return email.matches(emailRegex);
	}

	@Override
    public boolean verifyOTP(String session, String otp) {
        Otp storedOtp = otpRepository.findFirstBySessionOrderByCreatedTimeDesc(session).orElse(null);

        if (storedOtp != null) {
            if (storedOtp.getAttempts() >= MAX_ATTEMPTS) {
                log.warn("Maximum OTP verification attempts exceeded for session {}: {}", session);
                return false;
            }

            storedOtp.setAttempts(storedOtp.getAttempts() + 1);
            otpRepository.save(storedOtp);

            if (storedOtp.getOtp().equals(otp)) {
                if (storedOtp.getExpiryTime().isAfter(LocalDateTime.now()) && !storedOtp.isUsed()) {
                    storedOtp.setUsed(true);
                    storedOtp.setUsedTime(LocalDateTime.now());
                    otpRepository.save(storedOtp); // Mark OTP as used and set usedTime
                    log.info("OTP verified for session {}: {}", session, otp);
                    return true;
                } else {
                    log.warn("Expired or already used OTP for session {}: {}", session);
                }
            } else {
                log.warn("Invalid OTP for session {}: {}", session);
            }
        }
        return false;
    }

	

}
