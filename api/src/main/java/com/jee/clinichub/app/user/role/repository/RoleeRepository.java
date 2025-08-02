package com.jee.clinichub.app.user.role.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.core.projections.CommonProj;
import com.jee.clinichub.app.user.model.User;
import com.jee.clinichub.app.user.role.model.Role;

@Repository
public interface RoleeRepository extends JpaRepository<Role, Long> {
	
    Role findRoleByName(String name);

	boolean existsByName(String name);

	boolean existsByNameAndIdNot(String name, Long id);

	List<CommonProj> findAllProjectedBy();

	List<CommonProj> findAllProjectedByIsDisplay(boolean b);
	
	List<CommonProj> findAllProjectedByNameNotIn(List<String> names);

    Role findByName(String string);
}