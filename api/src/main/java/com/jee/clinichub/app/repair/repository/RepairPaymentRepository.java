package com.jee.clinichub.app.repair.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.repair.model.Repair;
import com.jee.clinichub.app.repair.model.RepairPayment;
import com.jee.clinichub.app.repair.model.RepairStatus;

@Repository
public interface RepairPaymentRepository extends JpaRepository<RepairPayment, Long> {

	List<RepairPayment> findAllByRepair_id(Long repairId);
	
 

}
