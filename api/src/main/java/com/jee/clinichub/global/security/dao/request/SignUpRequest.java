package com.jee.clinichub.global.security.dao.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignUpRequest {
	
    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private String password;
    private String tenant;
    private String phone;
}
