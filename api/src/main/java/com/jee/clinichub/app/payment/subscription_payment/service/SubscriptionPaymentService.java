package com.jee.clinichub.app.payment.subscription_payment.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.jee.clinichub.app.payment.subscription_payment.model.PaymentExplorationSearch;
import com.jee.clinichub.app.payment.subscription_payment.model.SubscriptionPaymentDto;
import com.jee.clinichub.app.payment.subscription_payment.model.SubscriptionPaymentProj;

public interface SubscriptionPaymentService {

    SubscriptionPaymentDto getById(Long id);

    Page<SubscriptionPaymentProj> getAllPaymentHistory(PaymentExplorationSearch search,Pageable pageable);

    byte[] downloadPaymentHistory(Long id);

    List<SubscriptionPaymentDto> getAllByTenantId(Long id);

    SubscriptionPaymentDto getActivePlan(Long id);

}
