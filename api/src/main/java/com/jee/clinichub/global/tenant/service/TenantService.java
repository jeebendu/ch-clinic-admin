package com.jee.clinichub.global.tenant.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.tenant.model.Tenant;
import com.jee.clinichub.global.tenant.model.TenantDto;
import com.jee.clinichub.global.tenant.model.TenantFilter;
import com.jee.clinichub.global.tenant.model.TenantProj;
import com.jee.clinichub.global.tenant.model.TenantRequest;
import com.jee.clinichub.global.tenant.model.TenantRequestDto;
import com.jee.clinichub.global.tenant.model.TenantRequestProj;
import com.jee.clinichub.global.tenant.model.WebInfo;

public interface TenantService {

	Status createUser(TenantDto tenantDto);

	void findWebInfoByClientId(String tenant);

	Tenant findByTenantId(String tenantOrClientId);

	Status request(TenantRequestDto tenantRequestDto, String subdomain);

	Status approve(Long id,String subdomain);

	WebInfo upload(MultipartFile logoFile, MultipartFile favFile, MultipartFile bannerFile);

	Status isExistsByTenantId(String clientId);

    List<TenantRequestProj> getAllTenantRequests();

    Page<TenantProj> filterAllTenant(Pageable pageable,TenantFilter filter);


	

	

}
