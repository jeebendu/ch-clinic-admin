package com.jee.clinichub.app.payment.type.service;

import java.util.List;

import com.jee.clinichub.app.payment.type.model.PaymentType;
import com.jee.clinichub.app.payment.type.model.PaymentTypeDto;
import com.jee.clinichub.global.model.Status;

public interface PaymentTypeService {
	
    PaymentType findByName(String name);

    PaymentTypeDto getById(Long id);

	Status deleteById(Long id);

	Status saveOrUpdate(PaymentTypeDto PaymentType);

	List<PaymentTypeDto> getAllPaymentTypes();
}
