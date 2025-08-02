package com.jee.clinichub.app.user.role.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.user.role.permission.model.Permission;

@Repository
public interface PermRepository extends JpaRepository<Permission, Long> {
	
  
}