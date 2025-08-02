package com.jee.clinichub.app.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jee.clinichub.app.user.model.UserToken;

public interface UserTokenRepository extends JpaRepository<UserToken, Long>{

	UserToken findByToken(String token);

	void removeByToken(String token);

	
}
