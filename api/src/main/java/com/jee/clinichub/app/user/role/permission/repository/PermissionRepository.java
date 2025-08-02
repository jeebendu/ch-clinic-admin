package com.jee.clinichub.app.user.role.permission.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.user.role.model.Role;

@Repository
public interface PermissionRepository extends JpaRepository<Role, Long> {
	
    Role findRoleByName(String name);

	boolean existsByName(String name);

	boolean existsByNameAndIdNot(String name, Long id);
}