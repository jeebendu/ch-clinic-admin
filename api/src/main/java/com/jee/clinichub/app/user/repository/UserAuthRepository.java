package com.jee.clinichub.app.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.user.model.UserAuth;

@Repository
public interface UserAuthRepository extends JpaRepository<UserAuth, Long> {
	
	
	//@Cacheable(value="userFindByUsername", key="#p0")
	UserAuth findByUsername(String username);
	
	UserAuth findByUsernameOrEmail(String username,String mail);
	
	UserAuth findByUsernameOrEmailOrPhone(String username,String mail,String phone);

	UserAuth findByEmail(String userEmail);

    UserAuth findByPhone(String userPhone);

}