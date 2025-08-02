package com.jee.clinichub.app.core.mail;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/mail")
public class MailController {
	
    @Autowired
    private  MailService mailService;

    
    @PostMapping("/send")
    public boolean sendMail(@Valid @RequestBody MailRequest mailRequest) {
    	return mailService.sendMail(mailRequest);
    }

}
