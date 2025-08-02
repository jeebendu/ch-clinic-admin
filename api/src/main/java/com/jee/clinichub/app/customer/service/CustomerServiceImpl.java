package com.jee.clinichub.app.customer.service;

import java.util.ArrayList;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.customer.model.Customer;
import com.jee.clinichub.app.customer.model.CustomerDto;
import com.jee.clinichub.app.customer.repository.CustomerRepository;
import com.jee.clinichub.global.model.Status;

@Service(value = "customerService")
public class CustomerServiceImpl implements CustomerService {
	
	private static final Logger log = LoggerFactory.getLogger(CustomerServiceImpl.class);

    @Autowired
    private CustomerRepository customerRepository;
    
	@Override
	public Status saveOrUpdate(CustomerDto customerDto) {
		try{
			
			//boolean isExistName = (customerDto.getId()==null) ? customerRepository.existsByName(customerDto.getName()): customerRepository.existsByNameAndIdNot(customerDto.getName(),customerDto.getId());
			boolean isExistPhone = (customerDto.getId()==null) ? customerRepository.existsByPhone(customerDto.getPhone()): customerRepository.existsByPhoneAndIdNot(customerDto.getPhone(),customerDto.getId());
			
			if(isExistPhone){return new Status(false,"Phone Name already exist");
	    	}else if(isExistPhone){return new Status(false,"Phone Code already exist");}
			
			Customer customer = new Customer();
			
			if(customerDto.getId()==null) {
				customer = new Customer(customerDto);
			}else{
				customer = this.setCustomer(customerDto);
			}
			
			customer = customerRepository.save(customer);
			return new Status(true,( (customerDto.getId()==null) ? "Added":"Updated")  +  " Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
		
	}
	
    private Customer setCustomer(CustomerDto customerDto) {
    	Customer exCustomer = customerRepository.findById(customerDto.getId()).get();
    	exCustomer.setFirstName(customerDto.getFirstName());
    	exCustomer.setLastName(customerDto.getLastName());
    	exCustomer.setPhone(customerDto.getPhone());
    	exCustomer.setAddress(customerDto.getAddress());
    	exCustomer.setEmail(customerDto.getEmail());
		return exCustomer;
		
	}

	@Override
  	public List<CustomerDto> getAllCustomers() {
    	List<Customer> customerList = new ArrayList<Customer>();
    	 customerList = customerRepository.findAll();
    	List<CustomerDto> customerDtoList = customerList.stream().map(CustomerDto::new).collect(Collectors.toList());
  		return customerDtoList;
  	}

    @Override
    public Customer findByName(String name) {
        Customer customer = customerRepository.findCustomerByFirstName(name);
        return customer;
    }
    
    
	@Override
	@Cacheable(value = "customerCache",keyGenerator = "multiTenantCacheKeyGenerator")
	public CustomerDto getById(Long id) {
		CustomerDto customerDto = new CustomerDto();
		try{
			Optional<Customer> customer = customerRepository.findById(id);
			if(customer.isPresent()){
				customerDto = new CustomerDto(customer.get());
			}
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return customerDto;
	}
	
	@Override
	@Cacheable(value = "customerCache",keyGenerator = "multiTenantCacheKeyGenerator")
	public Customer getCustomerById(Long id) {
		Customer customer = new Customer();
		try{
			Optional<Customer> _customer = customerRepository.findById(id);
			if(_customer.isPresent()){
				customer = _customer.get();
			}
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return customer;
	}
	
	

	@Override
	public Status deleteById(Long id) {
		try{
			Optional<Customer> customer = customerRepository.findById(id);
			if(!customer.isPresent()){
				return new Status(false,"Customer Not Found");
			}
			
			customerRepository.deleteById(id);
			return new Status(true,"Deleted Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
	}

	@Override
	public CustomerDto search(CustomerDto searchCustomer) {
		CustomerDto customerDto = new CustomerDto();
		try{
			Optional<Customer> customer = customerRepository.findByPhone(searchCustomer.getPhone());
			if(customer.isPresent()){
				customerDto = new CustomerDto(customer.get());
			}
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return customerDto;
	}

	

	
}
