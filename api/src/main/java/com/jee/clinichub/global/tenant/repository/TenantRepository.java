package com.jee.clinichub.global.tenant.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.global.tenant.model.Tenant;
import com.jee.clinichub.global.tenant.model.TenantProj;
import com.jee.clinichub.global.tenant.model.TenantRequest;
import com.jee.clinichub.global.tenant.model.TenantRequestProj;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, Long> {
	Optional<Tenant> findByClientId(String clientId);

	TenantRequest save(TenantRequest tenantRequest);

	boolean existsByClientId(String clientId);

	void deleteByClientId(String clientId);

	@Query("SELECT t FROM Tenant t " +
			"WHERE (:searchKey IS NULL OR " +
			"LOWER(t.schemaName) LIKE LOWER(CONCAT('%', :searchKey, '%')) OR " +
			"LOWER(t.title) LIKE LOWER(CONCAT('%', :searchKey, '%')) OR " +
			"LOWER(t.clientId) LIKE LOWER(CONCAT('%', :searchKey, '%'))) " +
			"ORDER BY t.id DESC")
	Page<TenantProj> searchTenants(Pageable pageable,@Param("searchKey") String searchKey);
}
