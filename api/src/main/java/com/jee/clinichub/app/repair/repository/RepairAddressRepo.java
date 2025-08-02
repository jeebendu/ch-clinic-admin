package com.jee.clinichub.app.repair.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jee.clinichub.app.repair.model.RepairAddress;

public interface RepairAddressRepo extends JpaRepository<RepairAddress, Long>{

}
