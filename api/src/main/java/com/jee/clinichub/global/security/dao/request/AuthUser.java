package com.jee.clinichub.global.security.dao.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthUser {
    
    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private String password;
    private String reason;
    private String tenant;
    private String phone;
    private String otp;
    private String authToken;


}
