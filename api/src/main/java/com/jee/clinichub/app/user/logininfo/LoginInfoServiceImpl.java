package com.jee.clinichub.app.user.logininfo;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.user.model.User;
import com.jee.clinichub.app.user.repository.UserRepository;
import com.jee.clinichub.global.security.entities.AuthToken;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class LoginInfoServiceImpl implements LoginInfoService {

	private final LogInfoRepository logInfoRepository;
	private final UserRepository userRepository;
	private final IpInfoService ipInfoService;

	@Async("taskExecutor")
	@Override
	public void saveLoginInfo(String username, AuthToken authToken, String ipAddress, String userAgent) {
		try {
			// Add a delay of 20 seconds
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
			log.error("Thread was interrupted", e);
		}

		User user = userRepository.findByUsernameOrEmailOrPhone(username, username, username).orElse(null);
		Boolean isLogin = authToken != null;

        // Fetch IP location
        IpInfo ipInfo = ipInfoService.getIpLocation(ipAddress);
		

		LogInfo.LogInfoBuilder logInfoBuilder = LogInfo.builder()
                .user(user)
                .loginTime(LocalDateTime.now())
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .status(isLogin)
                .userName(username);

		if (ipInfo != null) {
			logInfoBuilder
					.country(ipInfo.getCountry())
					.countryCode(ipInfo.getCountryCode())
					.region(ipInfo.getRegion())
					.city(ipInfo.getCity())
					.lat(ipInfo.getLat())
					.lon(ipInfo.getLon())
					.mobile(ipInfo.isMobile());
		}
		
		LogInfo loginInfo = logInfoBuilder.build();
		logInfoRepository.save(loginInfo);

	}


	@Override
	public Void logout(AuthToken userAuth) {
		LogInfo latestLogInfo = logInfoRepository.findTopByUser_idOrderByLoginTimeDesc(userAuth.getId());

		if (latestLogInfo != null) {
			// Update the logout_time
			latestLogInfo.setLogoutTime(LocalDateTime.now());
			logInfoRepository.save(latestLogInfo);
		}
		return null;
	}


	@Override
	public Page<LogInfo> getLoginPage(int page, int size, LoginSearch search) {
		Pageable pr = PageRequest.of(page, size);
        return logInfoRepository.filter( pr,
		search.getValue(),
		search.getStatus()!= null ? search.getStatus() : null,
		search.getMobile()!= null ? search.getMobile() : null
		// search.getDateFrom()!= null ? search.getDateFrom() : null
		);
	}



}
