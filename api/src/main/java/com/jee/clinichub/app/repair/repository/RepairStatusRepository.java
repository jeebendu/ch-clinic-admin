package com.jee.clinichub.app.repair.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.repair.model.Repair;
import com.jee.clinichub.app.repair.model.RepairStatus;

@Repository
public interface RepairStatusRepository extends JpaRepository<RepairStatus, Long> {
	
 

}
