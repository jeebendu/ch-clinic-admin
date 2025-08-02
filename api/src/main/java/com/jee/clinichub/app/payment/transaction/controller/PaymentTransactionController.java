package com.jee.clinichub.app.payment.transaction.controller;

import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.payment.transaction.model.PaymentTransactionDto;
import com.jee.clinichub.app.payment.transaction.model.PaymentTransactionSearch;
import com.jee.clinichub.app.payment.transaction.service.PaymentTransactionService;
import com.jee.clinichub.global.model.Status;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/payment/transaction")
public class PaymentTransactionController {

    @Autowired
    private PaymentTransactionService paymentTransactionService;
    
    
    
    @PostMapping(value="/list/{pageNumber}/{pageSize}")
    public Page<PaymentTransactionDto> filter(@RequestBody PaymentTransactionSearch search,@PathVariable int pageNumber,@PathVariable int pageSize){
        return paymentTransactionService.filter(  search, pageNumber, pageSize);
    }
    
    @Cacheable(value = "paymentTransactionCache",key = "#p0")
    @GetMapping(value="/id/{id}")
    public PaymentTransactionDto getById(@PathVariable Long id ){
        return paymentTransactionService.getById(id);
    }
    
    @CachePut(cacheNames = "paymentTransactionCache", key="#p0")
    @PostMapping(value="/saveOrUpdate")
    @ResponseBody
    public Status savePaymentTransaction(@RequestBody @Valid PaymentTransactionDto paymentTransaction,HttpServletRequest request,Errors errors){
        return paymentTransactionService.saveOrUpdate(paymentTransaction);
    }
    
   
    @CacheEvict(value="paymentTransactionCache", allEntries=true)
	@GetMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return paymentTransactionService.deleteById(id);
    }
 
   


}
