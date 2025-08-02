package com.jee.clinichub.app.core.sms;

public interface SmsService {
	
	public void sendSms(SmsRequest smsRequest);
	
	public void sendWhatsapp(SmsRequest smsRequest);

	void sendMediaMessage(String phoneNumber, String message, String mediaUrl);

}
