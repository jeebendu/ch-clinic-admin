package com.jee.clinichub.app.repair.repository;

import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.repair.model.AddressType;


@Repository
public interface AddressTypeRepository extends JpaRepository<AddressType, Long> {

	


}
