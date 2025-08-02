package com.jee.clinichub.app.user.repository;

import java.util.Optional;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.user.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	
	// Since email is unique, we'll find users by email
    Optional<User> findByEmail(String email);
	
	@Cacheable(value="userFindByUsername", key="#p0")
	Optional<User> findByUsername(String username);

	boolean existsByUsername(String username);

	boolean existsByUsernameAndIdNot(String username, Long id);

	boolean existsByEmail(String email);

	boolean existsByEmailAndIdNot(String email, Long id);

	boolean existsByPhone(String phone);

	boolean existsByPhoneAndIdNot(String phone, Long id);

	Optional<User> findByUsernameOrEmailOrPhone(String username, String username2, String username3);

    Optional<User> findByPhone(String phone);

	Optional<User> findByEmailOrPhone(String email, String email2);
}