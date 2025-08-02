package com.jee.clinichub.app.customer.transaction.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.customer.model.Customer;
import com.jee.clinichub.app.customer.repository.CustomerRepository;
import com.jee.clinichub.app.customer.transaction.Repository.CustomerTxnRepository;
import com.jee.clinichub.app.customer.transaction.model.CustomerTxn;
import com.jee.clinichub.app.customer.transaction.model.CustomerTxnDto;
import com.jee.clinichub.app.payment.type.service.PaymentTypeServiceImpl;
import com.jee.clinichub.global.model.Status;

@Service
public class CustomerTxnServiceImpl implements CustomerTxnService{
	private static final Logger log = LoggerFactory.getLogger(PaymentTypeServiceImpl.class);
	@Autowired private CustomerTxnRepository customerTxnRepository;
	@Autowired private CustomerRepository customerRepository;
	
	@Override
	public List<CustomerTxnDto> getAllTxn() {
		List<CustomerTxn> CustomerTxnList =customerTxnRepository .findAll();
    	List<CustomerTxnDto> CustomerTxnDtoList = CustomerTxnList.stream().map(CustomerTxnDto::new).collect(Collectors.toList());
  		return CustomerTxnDtoList;
	}

	@Override
	public CustomerTxnDto getTxnById(Long id) {
		CustomerTxnDto customerTxnDto = new CustomerTxnDto();
		try{
			Optional<CustomerTxn> customerTxn = customerTxnRepository.findById(id);
			if(customerTxn.isPresent()){
				customerTxnDto = new CustomerTxnDto(customerTxn.get());
			}
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return customerTxnDto;
	}

	@Override
	public Status deleteById(Long id) {
		try{
			Optional<CustomerTxn> customerTxn =customerTxnRepository .findById(id);
			if(!customerTxn.isPresent()){
				return new Status(false,"Price Not Found");
			}
			
			customerTxnRepository.deleteById(id);
			return new Status(true,"Deleted Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
	}

	@Override
	public Status saveOrUpdate(CustomerTxnDto customerTxnDto) {
		try {
			CustomerTxn customerTxn = new CustomerTxn();
			
			if(customerTxnDto.getId()==null) {
				customerTxn = new CustomerTxn(customerTxnDto);
			}else{
				customerTxn = this.setCustomerTxn(customerTxnDto);
			}
			
			
			customerTxn.setCustomer(customerRepository.findCustomerById(customerTxnDto.getCustomer().getId()));
			
			customerTxn = customerTxnRepository.save(customerTxn);
		
		}
		catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
	}

	private CustomerTxn setCustomerTxn(CustomerTxnDto customerTxnDto) {
		CustomerTxn exCustomerTxn = customerTxnRepository.findById(customerTxnDto.getId()).get();
		exCustomerTxn.setTxnDate(customerTxnDto.getTxnDate());
		exCustomerTxn.setRemark(customerTxnDto.getRemark());
		exCustomerTxn.setCredit(customerTxnDto.getCredit());
		exCustomerTxn.setDebit(customerTxnDto.getDebit());
		
		
		exCustomerTxn.setCustomer(new Customer(customerTxnDto.getCustomer()));
    
		return exCustomerTxn;
	}

	@Override
	public List<CustomerTxnDto> getTxnByVId(Long vId) {
		List<CustomerTxn> CustomerTxnList =customerTxnRepository .findAllByCustomer_id(vId);
    	List<CustomerTxnDto> CustomerTxnDtoList = CustomerTxnList.stream().map(CustomerTxnDto::new).collect(Collectors.toList());
  		return CustomerTxnDtoList;
	}
	

}
