package com.jee.clinichub.app.repair.repairTestDelivery.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.repair.repairTestDelivery.model.RepairTestDelivery;

@Repository
public interface RepairTestDeliveryRepository extends JpaRepository<RepairTestDelivery, Long>{

	Optional<RepairTestDelivery> findByRepair_id(Long id);
    
}
