package com.jee.clinichub.global.security.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import com.jee.clinichub.app.user.model.User;
import com.jee.clinichub.app.user.repository.UserRepository;
import com.jee.clinichub.app.user.resetPassword.model.PasswordResetReq;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.security.dao.request.AuthUser;
import com.jee.clinichub.global.security.dao.request.SignUpRequest;
import com.jee.clinichub.global.security.dao.request.SigninRequest;
import com.jee.clinichub.global.security.entities.AuthToken;
import com.jee.clinichub.global.security.service.AuthenticationService;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final UserRepository userAuthRepository;

    @Value("${app.url.web}")
    private String webUrl;

    @PostMapping("/signup")
    public ResponseEntity<Status> signup(@RequestBody SignUpRequest request) {
        return ResponseEntity.ok(authenticationService.signup(request));
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthToken> signin(@RequestBody SigninRequest request) {
        return ResponseEntity.ok(authenticationService.signin(request));
    }

    @PostMapping("/forgotPassword")
    public Status forgotPassword(@RequestBody PasswordResetReq request) {
        String email = request.getEmail();
        return authenticationService.forgotPassword(email);
    }

    @GetMapping("/verifyToken/{token}")
    public RedirectView verifyTokenAndRedirect(@PathVariable String token) {
        boolean isValid = authenticationService.verifyToken(token);
        webUrl = webUrl.replace("{{tenant}}", TenantContextHolder.getCurrentTenant());
        if (isValid) {
            // Redirect to a success page

            return new RedirectView(
                    webUrl + "/reset-password?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8));
        } else {
            // Redirect to a failure or login page
            return new RedirectView(webUrl + "/reset-password");
        }
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<?> setPassword(@RequestBody PasswordResetReq request) {

        String token = request.getToken();
        return ResponseEntity.ok(authenticationService.resetPassword(token, request.getPassword()));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody AuthToken userAuth) {
        return ResponseEntity.ok(authenticationService.logout(userAuth));
    }

    @PostMapping("/sendOtp")
    public Status sendOtp(@RequestBody AuthUser resendRequest) {
        return authenticationService.sendOtp(resendRequest);
    }

    @PostMapping("/verifyOtp")
    public Status verifyOTP(@RequestBody AuthUser request) {
        return authenticationService.verifyOTP(request);
    }

    @PostMapping("/verifyEmail")
    public Status verifyEmail(@RequestBody AuthUser request) {
        return authenticationService.verifyEmail(request);
    }

    @PostMapping("/otpLogin")
    public AuthToken otpLogin(@RequestBody AuthUser authUser) {
        return authenticationService.otpLogin(authUser);
    }

    @GetMapping("/isVerifyLogin")
    public boolean verifyToken() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Optional<User> user = userAuthRepository.findByUsername(authentication.getName());
            if (user.isPresent()) {
                return true;
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }

}
