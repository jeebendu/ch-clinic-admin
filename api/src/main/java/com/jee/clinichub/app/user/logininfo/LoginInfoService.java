package com.jee.clinichub.app.user.logininfo;

import org.springframework.data.domain.Page;

import com.jee.clinichub.global.security.entities.AuthToken;

public interface LoginInfoService {

	void saveLoginInfo(String username, AuthToken authToken, String ipAddress, String userAgent);

	Void logout(AuthToken userAuth);

    Page<LogInfo> getLoginPage(int page, int size, LoginSearch search);

	

}
