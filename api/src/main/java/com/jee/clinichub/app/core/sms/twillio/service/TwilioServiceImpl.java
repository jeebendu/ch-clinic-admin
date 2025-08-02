package com.jee.clinichub.app.core.sms.twillio.service;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.core.sms.SmsRequest;
import com.jee.clinichub.app.core.sms.SmsService;
import com.jee.clinichub.app.core.sms.twillio.config.TwilioConfiguration;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.rest.api.v2010.account.MessageCreator;
import com.twilio.type.PhoneNumber;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@ConditionalOnProperty(name = "sms.provider", havingValue = "twilio")
public class TwilioServiceImpl implements SmsService {

	private final TwilioConfiguration twilioConfiguration;

	public TwilioServiceImpl(TwilioConfiguration twilioConfiguration) {
		this.twilioConfiguration = twilioConfiguration;
	}

	@Override
	public void sendSms(SmsRequest smsRequest) {

		if (isPhoneVaild(smsRequest.getPhoneNumber())) {
			PhoneNumber to = new PhoneNumber(smsRequest.getPhoneNumber());
			PhoneNumber from = new PhoneNumber(this.twilioConfiguration.getTrailNumber());
			String message = smsRequest.getMessage();

			MessageCreator creator = Message.creator(to, from, message);

			creator.create();
			log.info("Send sms{}" + smsRequest);

		}
	}

	@Override
	public void sendWhatsapp(SmsRequest smsRequest) {

		if (isPhoneVaild(smsRequest.getPhoneNumber())) {
			PhoneNumber to = new PhoneNumber("whatsapp:" + smsRequest.getPhoneNumber());
			PhoneNumber from = new PhoneNumber("whatsapp:"+this.twilioConfiguration.getTrailWhatsapp());
			String message = smsRequest.getMessage();
			MessageCreator creator = Message.creator(to, from, message);

			creator.create();
			log.info("Send Whatsapp{}" + smsRequest);

		} else {
			log.info("invalid phone number {}");
			throw new IllegalArgumentException("Phone number [" + smsRequest.getPhoneNumber() + "] is not valid");
		}

	}

	private boolean isPhoneVaild(String phoneNumber) {
		// use google phone number validator
		return true;
	}

	@Override
	public void sendMediaMessage(String phoneNumber, String message, String mediaUrl) {
		// TODO Auto-generated method stub
		
	}

}
