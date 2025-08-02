package com.jee.clinichub.app.core.sms;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("v1/sms")
public class SmsController {
	
    @Autowired
    private  SmsService smsService;
/*
    public SmsController(SmsService smsService) {
        this.smsService = smsService;
    }*/
    
    @PostMapping("/sendSms")
    public void sendSms(@Valid @RequestBody SmsRequest smsRequest) {
    	smsService.sendSms(smsRequest);
    }
    
    @PostMapping("/sendWhatsapp")
    public void sendWhatsapp(@Valid @RequestBody SmsRequest smsRequest) {
    	smsService.sendWhatsapp(smsRequest);
    }
    
    @PostMapping("/sendBoth")
    public void sendBoth(@Valid @RequestBody SmsRequest smsRequest) {
    	smsService.sendSms(smsRequest);
    	smsService.sendWhatsapp(smsRequest);
    }
    
    @PostMapping("/sendMedia")
    public void sendMedia(@Valid @RequestBody SmsMediaRequest smsMediaRequest) {
        // Cast to HiSocialSmsService to access sendMediaMessage method
        if (smsService instanceof com.jee.clinichub.app.core.sms.hisocial.HiSocialSmsService) {
            ((com.jee.clinichub.app.core.sms.hisocial.HiSocialSmsService) smsService)
                .sendMediaMessage(smsMediaRequest.getPhoneNumber(), 
                                smsMediaRequest.getMessage(), 
                                smsMediaRequest.getMediaUrl());
        }
    }
}