package com.jee.clinichub.app.customer.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.customer.model.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
	
    Customer findCustomerByFirstName(String name);
    
    Customer findCustomerByPhone(String phone);

	boolean existsByPhone(String code);

	boolean existsByPhoneAndIdNot(String code, Long id);

	Customer findCustomerById(Long CustomerId);

	Optional<Customer> findByPhone(String phone);


}