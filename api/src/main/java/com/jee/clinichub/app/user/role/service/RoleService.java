package com.jee.clinichub.app.user.role.service;

import java.util.List;

import com.jee.clinichub.app.core.projections.CommonProj;
import com.jee.clinichub.app.user.role.model.Role;
import com.jee.clinichub.app.user.role.model.RoleDto;
import com.jee.clinichub.global.model.Status;

public interface RoleService {
	
    Role findByName(String name);

    RoleDto getById(Long id);

	Status deleteById(Long id);

	Status saveOrUpdate(RoleDto role);

	List<CommonProj> getAllRoles();

	List<CommonProj> getAllRolesByType(String type);
}
