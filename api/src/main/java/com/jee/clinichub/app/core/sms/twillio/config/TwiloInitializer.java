package com.jee.clinichub.app.core.sms.twillio.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;

import com.twilio.Twilio;

@Configuration
@ConditionalOnProperty(name = "sms.provider", havingValue = "twilio", matchIfMissing = false)
public class TwiloInitializer {

    private final TwilioConfiguration twilioConfiguration;

    private static final Logger LOGGER = LoggerFactory.getLogger(TwiloInitializer.class);

    @Autowired
    public TwiloInitializer(TwilioConfiguration twilioConfiguration) {
        this.twilioConfiguration = twilioConfiguration;

        Twilio.init(
                twilioConfiguration.getAccountSid(),
                twilioConfiguration.getAuthToken()
        );

        LOGGER.info("✅ Twilio initialized with account SID: {}", twilioConfiguration.getAccountSid());
    }
}