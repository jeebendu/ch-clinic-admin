package com.jee.clinichub.app.customer.transaction.service;

import java.util.List;

import com.jee.clinichub.app.customer.transaction.model.CustomerTxnDto;
import com.jee.clinichub.global.model.Status;

public interface CustomerTxnService {

	List<CustomerTxnDto> getAllTxn();

	CustomerTxnDto getTxnById(Long id);

	Status deleteById(Long id);

	Status saveOrUpdate(CustomerTxnDto customerTxnDto);

	List<CustomerTxnDto> getTxnByVId(Long vId);

}
