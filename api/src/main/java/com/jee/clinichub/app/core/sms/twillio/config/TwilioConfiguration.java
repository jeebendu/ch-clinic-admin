package com.jee.clinichub.app.core.sms.twillio.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Data
@Configuration
@ConfigurationProperties("twilio")
public class TwilioConfiguration {
    private  String accountSid;
    private  String authToken;
    private  String trailNumber;
    private  String trailWhatsapp;
}
