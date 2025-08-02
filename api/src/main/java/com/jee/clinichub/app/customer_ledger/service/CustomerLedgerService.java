package com.jee.clinichub.app.customer_ledger.service;

import java.util.List;


import com.jee.clinichub.app.customer_ledger.model.CustomerLedgerDto;
import com.jee.clinichub.global.model.Status;

public interface CustomerLedgerService {

	List<CustomerLedgerDto> getAllCTxn();

	CustomerLedgerDto getTxnById(Long id);

	

	

	List<CustomerLedgerDto> getTxnByCId(Long cId);

	

	Status deleteById(Long id);

	Status saveOrUpdate(CustomerLedgerDto customerLedgerDto);

}
