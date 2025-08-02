package com.jee.clinichub.app.user.resetPassword.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PasswordResetReq {
    private String email;
    private String password;
    private String token;
}
