package com.jee.clinichub.app.user.resetPassword.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.user.resetPassword.model.ResetPassword;

@Repository
public interface ResetPasswordRepository extends JpaRepository<ResetPassword, Long>{

    ResetPassword findByToken(String token);
	

}
