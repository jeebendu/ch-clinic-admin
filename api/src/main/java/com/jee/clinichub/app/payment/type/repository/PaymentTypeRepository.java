package com.jee.clinichub.app.payment.type.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.payment.type.model.PaymentType;

@Repository
public interface PaymentTypeRepository extends JpaRepository<PaymentType, Long> {

	PaymentType findPaymentTypeByName(String name);

	boolean existsByName(String name);

	boolean existsByNameAndIdNot(String name, Long id);
	
}