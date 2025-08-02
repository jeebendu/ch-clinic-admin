package com.jee.clinichub.app.repair.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.repair.model.Repair;
import com.jee.clinichub.app.repair.model.RepairCourier;
import com.jee.clinichub.app.repair.model.RepairPayment;
import com.jee.clinichub.app.repair.model.RepairStatus;

@Repository
public interface RepairCourierRepository extends JpaRepository<RepairCourier, Long> {

	List<RepairCourier> findAllByRepair_id(Long repairId);

	List<RepairCourier> findAllByRepairId(Long id);
	
 

}
