package com.jee.clinichub.global.security.service.impl;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.Base64;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.auth.InvalidCredentialsException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.branch.repository.BranchRepository;
import com.jee.clinichub.app.branch.service.BranchService;
import com.jee.clinichub.app.core.mail.MailRequest;
import com.jee.clinichub.app.core.mail.MailService;
import com.jee.clinichub.app.core.module.model.ModuleEnum;
import com.jee.clinichub.app.core.module.repository.ModuleRepository;
import com.jee.clinichub.app.core.sequence.service.SequenceService;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.app.patient.model.PatientSource;
import com.jee.clinichub.app.patient.repository.PatientRepository;
import com.jee.clinichub.app.staff.model.Staff;
import com.jee.clinichub.app.staff.repository.StaffRepository;
import com.jee.clinichub.app.user.logininfo.LoginInfoService;
import com.jee.clinichub.app.user.model.User;
import com.jee.clinichub.app.user.model.UserAuth;
import com.jee.clinichub.app.user.model.UserDetailsImpl;
import com.jee.clinichub.app.user.otp.service.OtpService;
import com.jee.clinichub.app.user.repository.UserAuthRepository;
import com.jee.clinichub.app.user.repository.UserRepository;
import com.jee.clinichub.app.user.resetPassword.model.ResetPassword;
import com.jee.clinichub.app.user.resetPassword.repository.ResetPasswordRepository;
import com.jee.clinichub.app.user.role.model.Role;
import com.jee.clinichub.app.user.role.repository.RoleeRepository;
import com.jee.clinichub.config.encryption.AesEncryption;
import com.jee.clinichub.config.env.EnvironmentProp;
import com.jee.clinichub.global.exception.UserNotActiveException;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.security.dao.request.AuthUser;
import com.jee.clinichub.global.security.dao.request.SignUpRequest;
import com.jee.clinichub.global.security.dao.request.SigninRequest;
import com.jee.clinichub.global.security.entities.AuthToken;
import com.jee.clinichub.global.security.entities.RoleEnum;
import com.jee.clinichub.global.security.service.AuthenticationService;
import com.jee.clinichub.global.security.service.JwtService;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;
import com.jee.clinichub.global.tenant.model.TenantRequest;
import com.jee.clinichub.global.tenant.repository.TenantRequestRepository;
import com.jee.clinichub.global.utility.DateUtility;
import com.ulisesbocchio.jasyptspringboot.exception.DecryptionException;
import com.jee.clinichub.app.core.module.model.Module;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

	private final UserRepository userRepository;
	private final BranchRepository branchRepository;
	private final StaffRepository staffRepository;
	private final RoleeRepository roleRepository;
	private final BranchService branchService;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;
	private final UserAuthRepository userAuthRepository;
	private final ResetPasswordRepository passwordResetTokenRepository;
	private final MailService mailService;
	private final TemplateEngine htmlTemplateEngine;
	private final AesEncryption aesEncryption;
	private final EnvironmentProp env;
	private final ResetPasswordRepository resetPasswordRepository;
	private final LoginInfoService loginInfoService;
	private final OtpService otpService;
	private final PatientRepository patientRepository;
	private final SequenceService sequenceService;
	private final ModuleRepository moduleRepository;
	private final TenantRequestRepository tenantRequeRepository;

	@Value("${app.url.api}")
	private String apiUrl;

	@Value("${app.domain.url}")
	private String domainUrl;

	@Override
	@Transactional
	public Status signup(SignUpRequest request) {

		TenantContextHolder.setCurrentTenant(request.getTenant());

		String decryptedPassword;

		Branch primaryBranch = branchService.getPrimaryBranch()
				.orElseThrow(() -> new RuntimeException("Primary branch not found"));

		try {
			decryptedPassword = aesEncryption.decrypt(request.getPassword());
		} catch (Exception e) {
			log.error("Error decrypting password", e);
			throw new AuthenticationServiceException("Failed to decrypt password", e);
		}

		var role = roleRepository.findRoleByName(RoleEnum.Admin.toString());
		Date effectiveFrom = new Date();
		var user = User.builder()
				.username(request.getUsername())
				.name(request.getFirstName() + request.getLastName())
				.email(request.getEmail()).password(passwordEncoder.encode(decryptedPassword))
				.branch(primaryBranch)
				.effectiveFrom(effectiveFrom)
				.role(role)
				.build();
		User userSaved = userRepository.save(user);

		UserDetails myUserDetails = UserDetailsImpl.build(userSaved);
		var jwt = jwtService.generateToken(myUserDetails);
		// return JwtAuthenticationResponse.builder().token(jwt).build();

		return new Status(true, jwt);
	}

	private String decryptPassword(String encryptedPassword) throws DecryptionException {
		try {
			return aesEncryption.decrypt(encryptedPassword);
		} catch (Exception e) {
			log.error("Error decrypting password", e);
			throw new DecryptionException("Failed to decrypt password", e);
		}
	}

	@Override
	public AuthToken signin(SigninRequest request) {
		log.info(TenantContextHolder.getCurrentTenant());
		String decryptedPassword;
		String username = request.getUsername();
		AuthToken authToken = null;

		try {
			decryptedPassword = decryptPassword(request.getPassword());
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(request.getUsername(), decryptedPassword));

			User user = userRepository.findByUsernameOrEmailOrPhone(username, username, username)
					.orElseThrow(() -> new UserNotActiveException("Invalid email or password."));

			Date effectiveTo = user.getEffectiveTo();
			Date effectiveFrom = user.getEffectiveFrom();
			effectiveTo = DateUtility.setEndOfDay(effectiveTo);
			String status = DateUtility.isActive(effectiveFrom, effectiveTo, new Date()) ? "active" : "inactive";

			if (!"active".equals(status)) {
				throw new UserNotActiveException("User is not active.");
			}

			UserDetails myUserDetails = UserDetailsImpl.build(user);
			var jwt = jwtService.generateToken(myUserDetails);

			UserAuth userAuth = userAuthRepository.findByUsername(username);
			authToken = this.getProfile(jwt, userAuth);

			// Capture necessary information from the HttpServletRequest
			HttpServletRequest httpRequest = getCurrentHttpRequest();
			String ipAddress = getClientIp(httpRequest);
			String userAgent = httpRequest.getHeader("User-Agent");
			// Call the asynchronous method with the captured information
			loginInfoService.saveLoginInfo(username, authToken, ipAddress, userAgent);

		} catch (Exception e) {
			log.error("Error during sign in", e);
			// Re-throw the exception to maintain the original behavior
		}
		return authToken;
	}

	private HttpServletRequest getCurrentHttpRequest() {
		ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder
				.getRequestAttributes();
		if (requestAttributes != null) {
			HttpServletRequest request = requestAttributes.getRequest();
			// logRequestHeaders(request);
			return request;
		}
		return null;
	}

	private String getClientIp(HttpServletRequest request) {
		String[] headers = {
				"cms-ipv4",
				"cf-connecting-ip", // Prioritize CF-Connecting-IP
				"x-forwarded-for",
				"X-Real-IP",
				"Proxy-Client-IP",
				"WL-Proxy-Client-IP",
				"HTTP_CLIENT_IP",
				"HTTP_X_FORWARDED_FOR"
		};

		return Arrays.stream(headers)
				.map(request::getHeader)
				.filter(ip -> ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip))
				.filter(ip -> !ip.equals("0:0:0:0:0:0:0:1") && !ip.equals("::1")) // Filter out localhost IPv6 addresses
				.flatMap(ip -> Arrays.stream(ip.split(",")).map(String::trim))
				// .filter(ip -> ip.contains(":"))
				.findFirst()
				.orElse(request.getRemoteAddr());
	}

	private void logRequestHeaders(HttpServletRequest request) {
		Map<String, String> headersMap = new HashMap<>();
		Enumeration<String> headerNames = request.getHeaderNames();
		if (headerNames != null) {
			while (headerNames.hasMoreElements()) {
				String headerName = headerNames.nextElement();
				String headerValue = request.getHeader(headerName);
				headersMap.put(headerName, headerValue);
			}
		}

		try {
			ObjectMapper objectMapper = new ObjectMapper();
			String jsonHeaders = objectMapper.writeValueAsString(headersMap);
			log.info("Request Headers: {}", jsonHeaders);
		} catch (Exception e) {
			log.error("Error converting headers to JSON", e);
		}
	}

	@Override
	public Void logout(AuthToken authToken) {
		return loginInfoService.logout(authToken);
	}

	private AuthToken getProfile(String token, UserAuth userAuth) {
		AuthToken user = new AuthToken();
		String name = (userAuth.getName() == null || userAuth.getName().equals(" "))
				? userAuth.getUsername().split("")[0]
				: userAuth.getName();
		user.setName(name);
		user.setBranchId(userAuth.getBranch().getId());
		user.setUsername(userAuth.getUsername());

		Staff staff = staffRepository.findByUser_Username(userAuth.getUsername()).orElse(null);

		Set<Branch> branchList = branchRepository.findAll().stream().collect(Collectors.toSet());
		if (staff != null) {
			branchList = staff.getBranchList();
			user.setName(staff.getFirstname() + " " + staff.getLastname());
		}
		Set<Long> branchIds = branchList.stream()
				.map(branch -> branch.getId())
				.collect(Collectors.toSet());

		user.setToken(token);
		user.setBranchIds(branchIds);
		user.setId(userAuth.getId());
		user.setRole(userAuth.getRole().getName());
		user.setRoleobj(userAuth.getRole());
		return user;
	}

	@Override
	public Status forgotPassword(String email) {
		try {
			Optional<User> user = userRepository.findByEmail(email);
			if (!user.isPresent()) {
				return new Status(false, "Invalid Email");
			}

			String tenant = TenantContextHolder.getCurrentTenant();
			String token = UUID.randomUUID().toString() + "::" + tenant;
			token = Base64.getEncoder().encodeToString(token.getBytes());

			ResetPassword resetPassword = new ResetPassword();
			resetPassword.setUser(user.get());
			resetPassword.setToken(token);
			resetPasswordRepository.save(resetPassword);

			String resetPasswordLink = apiUrl + "/api/v1/auth/verifyToken/" + token;
			String emailTemplate = generateResetPasswordEmail(user.get().getName(), resetPasswordLink);

			MailRequest mailRequest = new MailRequest(this, env.getSender(), user.get().getEmail(), "Reset Password",
					emailTemplate);
			mailService.sendMail(mailRequest);

			return new Status(true, "Check your email");
		} catch (Exception e) {
			e.printStackTrace();
			return new Status(false, "Something went wrong: " + e.getMessage());
		}
	}

	public String generateResetPasswordEmail(String name, String resetLink) {

		Context context = new Context();
		context.setVariable("name", name);
		context.setVariable("resetLink", resetLink);

		final String htmlContent = this.htmlTemplateEngine.process("reset-password-email.html", context);
		return htmlContent;

	}

	/**
	 * Verifies the validity of a token.
	 * 
	 * @param token the token to be verified
	 * @return true if the token is valid and has not expired, false otherwise
	 */
	@Override
	public boolean verifyToken(String token) {

		ResetPassword resetToken = passwordResetTokenRepository.findByToken(token);
		if (resetToken != null && resetToken.getResetTime() == null) {
			LocalDateTime tokenCreationTime = resetToken.getCreatedTime().toInstant()
					.atZone(ZoneId.systemDefault()).toLocalDateTime();
			LocalDateTime expirationTime = tokenCreationTime.plusHours(24);
			LocalDateTime now = LocalDateTime.now();
			return now.isBefore(expirationTime);
		}

		return false;
	}

	@Override
	public Status resetPassword(String token, String newPassword) {

		log.info("Resetting password for token: {}", TenantContextHolder.getCurrentTenant());
		ResetPassword resetToken = passwordResetTokenRepository.findByToken(token);
		String decryptedPassword;
		try {
			decryptedPassword = aesEncryption.decrypt(newPassword);
		} catch (Exception e) {
			log.error("Error decrypting password", e);
			throw new AuthenticationServiceException("Failed to decrypt password", e);
		}

		if (resetToken == null) {
			throw new EntityNotFoundException("Invalid token");

		}
		if (!verifyToken(token)) {
			throw new EntityNotFoundException("Token expired");

		}
		// Additional checks for token validity can be added here
		User user = resetToken.getUser();
		user.setPassword(passwordEncoder.encode(decryptedPassword));
		userRepository.save(user);

		resetToken.setResetTime(new Date());
		passwordResetTokenRepository.save(resetToken);

		// userService.changeUserPassword(user, newPassword);
		return new Status(true, "Password reset successfully");

	}

	@Override
	public Status sendClinicApprovalAndAdminUserEmail(User user, TenantRequest tenantRequest) {

		String tenant = TenantContextHolder.getCurrentTenant();

		// Generate reset token
		String token = UUID.randomUUID().toString() + "::" + tenant;
		token = Base64.getEncoder().encodeToString(token.getBytes());

		// Store reset password token
		ResetPassword resetPassword = new ResetPassword();
		resetPassword.setUser(user);
		resetPassword.setToken(token);
		resetPasswordRepository.save(resetPassword);

		// Prepare reset password link
		String resetPasswordLink = apiUrl + "/api/v1/auth/verifyToken/" + token;

		// Extract values from TenantRequest
		String clinicName = Optional.ofNullable(tenantRequest.getTitle()).orElse(tenantRequest.getName());
		String contactName = Optional.ofNullable(tenantRequest.getContactName()).orElse(user.getName());
		String username = user.getEmail(); // Used for login
		String clinicUrl = Optional.ofNullable(tenantRequest.getClientUrl())
				.map(url -> "https://" + url)
				.orElse("https://" + tenant + "." + domainUrl);
		String email = user.getEmail();

		// Prepare Thymeleaf context
		Context context = new Context();
		context.setVariable("clinicName", clinicName);
		context.setVariable("contactName", contactName);
		context.setVariable("username", username);
		context.setVariable("clinicUrl", clinicUrl);
		context.setVariable("resetLink", resetPasswordLink);
		context.setVariable("email", email);

		// Prepare HTML email from template
		String emailTemplate = this.htmlTemplateEngine.process("clinic-approval-email.html", context);
		String subject = "Welcome to ClinicHub.Care – Your Clinic (" + clinicName + ") is Ready!";

		// Send email
		MailRequest mailRequest = new MailRequest(this, env.getSender(), email, subject, emailTemplate);
		mailService.sendMail(mailRequest);

		return new Status(true, "Clinic approval email sent.");
	}

	@Override
	public Status sendFirstTimeUserCreation(User user) {

		String tenant = TenantContextHolder.getCurrentTenant();
		String token = UUID.randomUUID().toString() + "::" + tenant;
		token = Base64.getEncoder().encodeToString(token.getBytes());

		ResetPassword resetPassword = new ResetPassword();
		resetPassword.setUser(user);
		resetPassword.setToken(token);
		resetPasswordRepository.save(resetPassword);

		String resetPasswordLink = apiUrl + "/api/v1/auth/verifyToken/" + token;

		String emailTemplate = generateFirstTimeUserCreationEmail(tenant, user.getName(), resetPasswordLink);

		String subject = "User Creation " + tenant;
		MailRequest mailRequest = new MailRequest(this, env.getSender(), user.getEmail(), subject, emailTemplate);
		mailService.sendMail(mailRequest);

		return new Status(true, "check your email");

	}

	public String generateFirstTimeUserCreationEmail(String tenant, String name, String resetLink) {

		Context context = new Context();
		context.setVariable("name", name);
		context.setVariable("tenant", name);
		context.setVariable("resetLink", resetLink);

		final String htmlContent = this.htmlTemplateEngine.process("user-creation-email.html", context);
		return htmlContent;

	}

	@Override
	public Status sendOtp(AuthUser authUser) {
		TenantContextHolder.setCurrentTenant(authUser.getTenant());

		return sendOtp(authUser.getPhone(), authUser.getEmail(), authUser.getReason());
	}

	private Status sendOtp(String mobile, String email, String reason) {
		if ((mobile == null || mobile.isBlank()) && (email == null || email.isBlank())) {
			return new Status(false, "Email or Phone is required");
		}

		String phone = (mobile != null && !mobile.trim().isEmpty()) ? mobile.trim() : null;
		String cleanEmail = (email != null && !email.trim().isEmpty()) ? email.trim() : null;

		Optional<User> userOptional = Optional.empty();
		if (cleanEmail != null) {
			userOptional = userRepository.findByEmail(cleanEmail);
		} else if (phone != null) {
			userOptional = userRepository.findByPhone(phone);
		}

		if (userOptional.isEmpty()) {
			User user = ctrateUserDuringLogin(mobile, email);
			return sendOtp(user, reason);
		}
		return sendOtp(userOptional.get(), reason);
	}

	private Status sendOtp(User user, String reason) {
		String session = otpService.sendOTP(user, reason);
		return new Status(true, session + "::OTP sent to your mail");
	}

	@Override
	public Status verifyOTP(AuthUser registerRequest) {
		if (otpService.verifyOTP(registerRequest.getAuthToken(), registerRequest.getOtp())) {
			return new Status(true, "OTP verified successfully");
		} else {
			return new Status(false, "Invalid or expired OTP");
		}
	}

	public User ctrateUserDuringLogin(String phone, String email) {

		Patient patient = new Patient();
		Module module = moduleRepository.findByName(ModuleEnum.patients.toString());
		String nextSequense;

		if (phone != null && !phone.equals("")) {
			patient.setWhatsappNo(phone);
			patient.setAlternativeContact(phone);
			// userOptional = userRepository.findByEmailOrPhone(phone, phone);
		}

		// Create a new user if not exists
		Branch branch = new Branch();
		Optional<Branch> optionalBranch = branchService.getPrimaryBranch();
		if (optionalBranch.isPresent()) {
			branch = optionalBranch.get();
		}
		Date effectiveFrom = new Date();

		Role role = roleRepository.findByName("Patient");

		User user = new User(email, phone);
		user.setUsername((phone != null && !phone.isEmpty() && !phone.isBlank() && !phone.equals("")) ? phone : email);
		user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
		user.setRole(role);
		user.setName(" ");
		user.setBranch(branch);
		user.setEffectiveFrom(effectiveFrom);
		User userSaved = userRepository.save(user);

		nextSequense = sequenceService.getNextSequense(user.getBranch().getId(), module.getId());
		patient.setUser(userSaved);
		patient.setFirstname(" ");
		patient.setLastname(" ");
		patient.setBranch(branch);
		patient.setUid(nextSequense);
		patient.setSource(PatientSource.ONLINE);
		patientRepository.save(patient);
		log.info(email + " registered successfully.");
		sequenceService.incrementSequense(branch.getId(),
				module.getId(), nextSequense);

		return userSaved;

	}

	@Override
	public AuthToken otpLogin(AuthUser authUser) {
		try {
			// Normalize input
			String email = StringUtils.isBlank(authUser.getEmail()) ? null : authUser.getEmail().trim();
			String phone = StringUtils.isBlank(authUser.getPhone()) ? null : authUser.getPhone().trim();

			if (email == null && phone == null) {
				throw new InvalidCredentialsException("Email or phone is required for login");
			}

			// Retrieve user based on available identifier
			Optional<User> userOptional = Optional.empty();
			if (email != null) {
				userOptional = userRepository.findByEmail(email);
			} else if (phone != null) {
				userOptional = userRepository.findByPhone(phone);
			}

			if (userOptional.isEmpty()) {
				throw new InvalidCredentialsException("Invalid credentials: user not found");
			}

			User user = userOptional.get();

			// Verify OTP
			if (!otpService.verifyOTP(authUser.getAuthToken(), authUser.getOtp())) {
				throw new InvalidCredentialsException("Invalid or expired OTP");
			}

			// Ensure role is "Patient"
			boolean isPatientRole = "Patient".equals(user.getRole().getName());
			if (!isPatientRole) {
				throw new InvalidCredentialsException("Access denied: only Patient role allowed");
			}

			// Generate JWT
			UserDetails myUserDetails = UserDetailsImpl.build(user);
			String jwt = jwtService.generateToken(myUserDetails);

			String userEmail = StringUtils.isBlank(user.getEmail()) ? null : user.getEmail().trim();
			String userPhone = StringUtils.isBlank(user.getPhone()) ? null : user.getPhone().trim();
			String userUsername = StringUtils.isBlank(user.getUsername()) ? null : user.getUsername().trim();

			// Fetch UserAuth safely
			// UserAuth userAuth = userAuthRepository.findByUsernameOrEmailOrPhone(
			// userUsername,
			// userEmail,
			// userPhone);
			UserAuth userAuth = null;
			if (userUsername != null) {
				userAuth = userAuthRepository.findByUsername(userUsername);
			} else if (userEmail != null) {
				userAuth = userAuthRepository.findByEmail(userEmail);
			} else if (userPhone != null) {
				userAuth = userAuthRepository.findByPhone(userPhone);
			}

			// Prepare AuthToken
			AuthToken authToken = getProfile(jwt, userAuth);

			// Log login info
			HttpServletRequest httpRequest = getCurrentHttpRequest();
			String ipAddress = getClientIp(httpRequest);
			String userAgent = httpRequest.getHeader("User-Agent");

			loginInfoService.saveLoginInfo(user.getUsername(), authToken, ipAddress, userAgent);

			return authToken;

		} catch (Exception e) {
			throw new AuthenticationServiceException("Error during OTP login", e);
		}
	}

	@Override
	public Status verifyEmail(AuthUser authUser) {
		TenantContextHolder.setCurrentTenant(authUser.getTenant());
		return verifyEmail(authUser.getPhone(), authUser.getEmail(), authUser.getReason());
	}

	public Status verifyEmail(String mobile, String email, String reason) {
		try {
			if (mobile == null && email == null) {
				return new Status(false, "Email or Phone is required");

			}
			boolean isExistEmail = tenantRequeRepository.existsByEmail(email);
			if (isExistEmail) {
				return new Status(false, "Clinic exists with Email: " + email);
			}

			User user = new User();
			user.setEmail(email);
			user.setPhone(mobile);
			return sendOtp(user, reason);
		} catch (Exception e) {
			return new Status(false, "Error sending verification email: " + e.getMessage());
		}
	}

}
