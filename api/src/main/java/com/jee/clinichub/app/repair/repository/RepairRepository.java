package com.jee.clinichub.app.repair.repository;

import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.repair.model.Repair;

@Repository
public interface RepairRepository extends JpaRepository<Repair, Long> {

	@Cacheable(value = "repairCache" , keyGenerator = "multiTenantCacheKeyGenerator")
	List<Repair> findAllByBranch_id(Long id);
	
   // Repair findRepairByName(String name);

	//boolean existsByName(String name);

	//boolean existsByNameAndIdNot(String name, Long id);

	//boolean existsByCode(String code);

	//boolean existsByCodeAndIdNot(String code, Long id);

	//Repair findRepairById(Long repairId);


}
