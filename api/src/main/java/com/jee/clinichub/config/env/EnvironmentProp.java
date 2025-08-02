package com.jee.clinichub.config.env;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;

@Configuration
@Getter
public class EnvironmentProp {
	
	@Value("${aes.key}")
	String aesKey;

	@Value("${mail.smtp.username}")
	String sender;

	@Value("${hisocial.api.url:https://hisocial.in/api/send}")
	String hisocialApiUrl;

	@Value("${hisocial.instance.id}")
	String hisocialInstanceId;

	@Value("${hisocial.access.token}")
	String hisocialAccessToken;

}
