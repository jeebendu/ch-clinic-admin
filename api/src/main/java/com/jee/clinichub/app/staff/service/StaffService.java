package com.jee.clinichub.app.staff.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.staff.model.Staff;
import com.jee.clinichub.app.staff.model.StaffDto;
import com.jee.clinichub.app.staff.model.StaffProj;
import com.jee.clinichub.app.staff.model.StaffSearch;
import com.jee.clinichub.app.user.model.UserSearch;
import com.jee.clinichub.global.context.UserCreationContext;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.tenant.model.TenantRequest;

import jakarta.annotation.Nullable;

public interface StaffService {
	
	Staff findByName(String name);

    StaffDto getById(Long id);

	Status deleteById(Long id);

	Status saveOrUpdate(StaffDto staffDto,MultipartFile profile, UserCreationContext context,  @Nullable TenantRequest tenantRequest);

	List<StaffProj> getAllStaffs();

	Page<StaffProj> getStaffPage(int page, int size, StaffSearch search);

	 Page<StaffProj> search(UserSearch userSearch, int pageNo, int pageSize);

	void createStaffFromTenantRequest(TenantRequest tenantRequest, Branch savedBranch);

    StaffProj getMyProfile();



}
