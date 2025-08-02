package com.jee.clinichub.app.customer_ledger.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.jee.clinichub.app.customer_ledger.Repository.CustomerLedgerRepository;
import com.jee.clinichub.app.customer_ledger.model.CustomerLedger;
import com.jee.clinichub.app.customer_ledger.model.CustomerLedgerDto;
import com.jee.clinichub.global.model.Status;

@Service
public class CustomerLedgerServiceImpl implements CustomerLedgerService{
	private static final Logger log = LoggerFactory.getLogger(CustomerLedgerServiceImpl.class);
	@Autowired private CustomerLedgerRepository customerLedgerRepository;
	
	
	@Override
	public List<CustomerLedgerDto> getAllCTxn() {
		List<CustomerLedger> customerLedgerList =customerLedgerRepository .findAll();
    	List<CustomerLedgerDto> customerLedgerDtoList = customerLedgerList.stream().map(CustomerLedgerDto::new).collect(Collectors.toList());
  		return customerLedgerDtoList;
	}

	@Override
	public CustomerLedgerDto getTxnById(Long id) {
		CustomerLedgerDto customerLedgerDto = new CustomerLedgerDto();
		try{
			Optional<CustomerLedger> customerLedger = customerLedgerRepository.findById(id);
			if(customerLedger.isPresent()){
				customerLedgerDto = new CustomerLedgerDto(customerLedger.get());
			}
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return customerLedgerDto;
	}

	@Override
	public Status deleteById(Long id) {
		try{
			Optional<CustomerLedger> customerLedger =customerLedgerRepository .findById(id);
			if(!customerLedger.isPresent()){
				return new Status(false,"Price Not Found");
			}
			
			customerLedgerRepository.deleteById(id);
			return new Status(true,"Deleted Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
	}

	

	

	@Override
	public List<CustomerLedgerDto> getTxnByCId(Long cId) {
		List<CustomerLedger> customerLedgerList =customerLedgerRepository .findAllByCustomer_id(cId);
    	List<CustomerLedgerDto> customerLedgerDtoList = customerLedgerList.stream().map(CustomerLedgerDto::new).collect(Collectors.toList());
  		return customerLedgerDtoList;
	}

	@Override
	public Status saveOrUpdate(CustomerLedgerDto customerLedgerDto) {
		// TODO Auto-generated method stub
		return null;
	}

	
	

}
