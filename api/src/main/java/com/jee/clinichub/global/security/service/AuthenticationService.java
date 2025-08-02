package com.jee.clinichub.global.security.service;

import com.jee.clinichub.app.user.model.User;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.security.dao.request.AuthUser;
import com.jee.clinichub.global.security.dao.request.SignUpRequest;
import com.jee.clinichub.global.security.dao.request.SigninRequest;
import com.jee.clinichub.global.security.entities.AuthToken;
import com.jee.clinichub.global.tenant.model.TenantRequest;

public interface AuthenticationService {
	
    Status signup(SignUpRequest request);

    AuthToken signin(SigninRequest request);

	Status forgotPassword(String email);

    boolean verifyToken(String token);

    Status resetPassword(String token, String newPassword) ;

	Status sendFirstTimeUserCreation(User user);

    Void logout(AuthToken userAuth);

    Status sendOtp(AuthUser resendRequest);

    Status verifyOTP(AuthUser request);

    public AuthToken otpLogin(AuthUser authUser);

	Status sendClinicApprovalAndAdminUserEmail(User user, TenantRequest tenantRequest);

    Status verifyEmail(AuthUser request);

	
}
