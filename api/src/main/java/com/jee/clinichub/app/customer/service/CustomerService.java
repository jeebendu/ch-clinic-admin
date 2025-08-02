package com.jee.clinichub.app.customer.service;

import java.util.List;

import com.jee.clinichub.app.customer.model.Customer;
import com.jee.clinichub.app.customer.model.CustomerDto;
import com.jee.clinichub.global.model.Status;

public interface CustomerService {
	
    Customer findByName(String name);

    CustomerDto getById(Long id);

	Status deleteById(Long id);

	Status saveOrUpdate(CustomerDto Customer);

	List<CustomerDto> getAllCustomers();

	Customer getCustomerById(Long id);

	CustomerDto search(CustomerDto customer);
}
