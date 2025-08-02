package com.jee.clinichub.app.user.otp.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.user.otp.model.Otp;



@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {
    Optional<Otp> findFirstByUserIdOrderByCreatedTimeDesc(Long userId);
    void deleteByUserId(Long userId);
    Optional<Otp> findFirstBySessionOrderByCreatedTimeDesc(String session);
}