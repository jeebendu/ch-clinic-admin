package com.jee.clinichub.app.customer.transaction.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.customer.transaction.model.CustomerTxnDto;
import com.jee.clinichub.app.customer.transaction.service.CustomerTxnService;
import com.jee.clinichub.global.model.Status;

@RestController
@RequestMapping("v1/customer/transaction")
public class CustomerTxnController {
	@Autowired  CustomerTxnService customerTxnService;
	
	@GetMapping("/list")
    public List<CustomerTxnDto> getAllTxn() {
	 return	customerTxnService.getAllTxn();
		
	}
	
	@GetMapping("/list/{vId}")
    public List<CustomerTxnDto> getTxnByVId(@PathVariable Long vId) {
	 return	customerTxnService.getTxnByVId(vId);
		
	}
	
	
	@GetMapping("/id/{id}")
    public CustomerTxnDto getTxnById(@PathVariable Long id) {
	 return	customerTxnService.getTxnById(id);
		
	}
	
	
    @GetMapping("delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
	 return	customerTxnService.deleteById(id);
		
	}
	
	@PostMapping("/saveOrUpdate")
    public Status saveOrUpdate(@RequestBody CustomerTxnDto customerTxnDto) {
	 return	customerTxnService.saveOrUpdate(customerTxnDto);
		
	}
}
