package com.jee.clinichub.global.tenant.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.global.tenant.model.TenantRequest;
import com.jee.clinichub.global.tenant.model.TenantRequestProj;

@Repository
public interface TenantRequestRepository extends JpaRepository<TenantRequest, Long> {
    Optional<TenantRequest> findByClientId(String clientId);

	void deleteByClientId(String clientId);

    boolean existsByEmail(String email);

    @Query("SELECT t FROM TenantRequest t ")
    List<TenantRequestProj> findAllTenantRequest();



}
