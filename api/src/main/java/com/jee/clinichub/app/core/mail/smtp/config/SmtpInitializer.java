package com.jee.clinichub.app.core.mail.smtp.config;

import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import jakarta.mail.Authenticator;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;

@Configuration
public class SmtpInitializer {
	
    private final static Logger LOGGER = LoggerFactory.getLogger(SmtpInitializer.class);
    
    private final SmtpConfiguration smtpConfig;

    @Autowired
    public SmtpInitializer(SmtpConfiguration smtpConfig) {
        this.smtpConfig = smtpConfig;
        
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", smtpConfig.getHost());
        props.put("mail.smtp.port", "587");
        
        // Get the Session object.
        Session session = Session.getInstance(props,
        new Authenticator() {
           protected PasswordAuthentication getPasswordAuthentication() {
              return new PasswordAuthentication(smtpConfig.getUsername(), smtpConfig.getPassword());
           }
        });
        smtpConfig.setSession(session);
        
        LOGGER.info("SMTP initialised with Host {}", smtpConfig.getHost());
    }
}
