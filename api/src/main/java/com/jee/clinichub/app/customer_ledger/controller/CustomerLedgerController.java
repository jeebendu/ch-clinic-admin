package com.jee.clinichub.app.customer_ledger.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.customer_ledger.model.CustomerLedgerDto;
import com.jee.clinichub.app.customer_ledger.service.CustomerLedgerService;
import com.jee.clinichub.global.model.Status;





@RestController
@RequestMapping("v1/customerLedger")
public class CustomerLedgerController {
	@Autowired  CustomerLedgerService customerLedgerService;
	
	@GetMapping("/list")
    public List<CustomerLedgerDto> getAllCTxn() {
	 return	customerLedgerService.getAllCTxn();
		
	}
	
	
	
	@GetMapping("/list/{cId}")
    public List<CustomerLedgerDto> getTxnByCId(@PathVariable Long cId) {
	 return	customerLedgerService.getTxnByCId(cId);
		
	}
	
	
	@GetMapping("/id/{id}")
    public CustomerLedgerDto getTxnById(@PathVariable Long id) {
	 return	customerLedgerService.getTxnById(id);
		
	}
	
	
    @GetMapping("delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
	 return	customerLedgerService.deleteById(id);
		
	}
	
	@PostMapping("/saveOrUpdate")
    public Status saveOrUpdate(@RequestBody CustomerLedgerDto customerLedgerDto) {
	 return	customerLedgerService.saveOrUpdate(customerLedgerDto);
		
	}
}
