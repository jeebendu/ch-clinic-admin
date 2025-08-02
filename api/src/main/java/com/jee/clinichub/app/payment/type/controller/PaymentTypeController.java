package com.jee.clinichub.app.payment.type.controller;

import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.payment.type.model.PaymentTypeDto;
import com.jee.clinichub.app.payment.type.service.PaymentTypeService;
import com.jee.clinichub.global.model.Status;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/payment/type")
public class PaymentTypeController {

    @Autowired
    private PaymentTypeService paymentTypeService;

    @Cacheable(value = "paymentTypeCache" , keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/list")
    public List<PaymentTypeDto> getAllPaymentTypees(){
        return paymentTypeService.getAllPaymentTypes();
    }
    
    @Cacheable(value = "paymentTypeCache",key = "#p0")
    @GetMapping(value="/id/{id}")
    public PaymentTypeDto getById(@PathVariable Long id ){
        return paymentTypeService.getById(id);
    }
    
    @CachePut(cacheNames = "paymentTypeCache", key="#p0")
    @PostMapping(value="/saveOrUpdate")
    @ResponseBody
    public Status savePaymentType(@RequestBody @Valid PaymentTypeDto paymentType,HttpServletRequest request,Errors errors){
        return paymentTypeService.saveOrUpdate(paymentType);
    }
    
   
    @CacheEvict(value="paymentTypeCache", allEntries=true)
	@GetMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return paymentTypeService.deleteById(id);
    }

}
