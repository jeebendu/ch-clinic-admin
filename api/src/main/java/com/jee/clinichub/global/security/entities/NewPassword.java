package com.jee.clinichub.global.security.entities;




import lombok.Data;

@Data
public class NewPassword {
   
  private String token;
    private String password;
    private String confirmPassword;
   
}
