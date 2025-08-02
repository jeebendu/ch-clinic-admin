package com.jee.clinichub.app.core.module.repository;

import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.core.module.model.Module;
import com.jee.clinichub.app.core.projections.CommonProj;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {

	@Cacheable(value = "moduleCache" , keyGenerator = "multiTenantCacheKeyGenerator")
	Module findByName(String name);

	@Cacheable(value = "moduleCache" , keyGenerator = "multiTenantCacheKeyGenerator")
	List<CommonProj> findAllProjectedByOrderByNameAsc();
	

}