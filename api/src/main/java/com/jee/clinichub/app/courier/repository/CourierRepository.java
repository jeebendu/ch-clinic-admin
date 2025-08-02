package com.jee.clinichub.app.courier.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.courier.model.Courier;

@Repository
public interface CourierRepository extends JpaRepository<Courier, Long> {
	Courier findBranchByName(String name);

	boolean existsByName(String name);

	boolean existsByNameAndIdNot(String name, Long id);



}