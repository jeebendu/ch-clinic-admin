package com.jee.clinichub.app.payment.transaction.service;

import org.springframework.data.domain.Page;

import com.jee.clinichub.app.payment.transaction.model.PaymentTransactionDto;
import com.jee.clinichub.app.payment.transaction.model.PaymentTransactionSearch;
import com.jee.clinichub.global.model.Status;

public interface PaymentTransactionService {
	
   

    PaymentTransactionDto getById(Long id);

	Status deleteById(Long id);

	Status saveOrUpdate(PaymentTransactionDto PaymentTransaction);

	//List<PaymentTransactionDto> getAllPaymentTransactions();


	Page<PaymentTransactionDto> filter(PaymentTransactionSearch search, int pageNumber, int pageSize);

	//  Page<PaymentTransactionDto> search(PaymentTransactionSearch trans, int pageNo, int pageSize);
}
