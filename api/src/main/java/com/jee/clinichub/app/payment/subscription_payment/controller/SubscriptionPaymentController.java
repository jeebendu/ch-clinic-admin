package com.jee.clinichub.app.payment.subscription_payment.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.payment.subscription_payment.model.PaymentExplorationSearch;
import com.jee.clinichub.app.payment.subscription_payment.model.SubscriptionPaymentDto;
import com.jee.clinichub.app.payment.subscription_payment.model.SubscriptionPaymentProj;
import com.jee.clinichub.app.payment.subscription_payment.service.SubscriptionPaymentService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/v1/tenant-subscription")
public class SubscriptionPaymentController {

@Autowired
private SubscriptionPaymentService subscriptionPaymentService;

       @GetMapping( path="/id/{id}")
    public SubscriptionPaymentDto getById(@PathVariable Long id ){
        return  subscriptionPaymentService.getById(id);
    }


    @GetMapping( path="tenant/id/{id}")
    public List<SubscriptionPaymentDto> getAllByTenantId(@PathVariable Long id ){
        return  subscriptionPaymentService.getAllByTenantId(id);
    }


    @GetMapping( path="/active-plan/tenant/id/{id}")
    public SubscriptionPaymentDto getActivePlan(@PathVariable Long id){
        return  subscriptionPaymentService.getActivePlan(id);
    }


     @PostMapping("/list")
    public Page<SubscriptionPaymentProj> getAllPaymentHistory(@RequestBody PaymentExplorationSearch search,Pageable pageable) {
        return subscriptionPaymentService.getAllPaymentHistory(search,pageable);
    }

    @GetMapping("/download/{id}")
    public byte[] downloadPaymentHistory(@PathVariable Long id) {
        return subscriptionPaymentService.downloadPaymentHistory(id);
    }


}
