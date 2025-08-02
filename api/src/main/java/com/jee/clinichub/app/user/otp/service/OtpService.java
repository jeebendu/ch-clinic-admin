package com.jee.clinichub.app.user.otp.service;

import com.jee.clinichub.app.user.model.User;


public interface OtpService {

	String sendOTP(User user,String reason);
    boolean verifyOTP(String session, String otp);

}
