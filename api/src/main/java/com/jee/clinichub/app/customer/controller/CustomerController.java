package com.jee.clinichub.app.customer.controller;

import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
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

import com.jee.clinichub.app.customer.model.CustomerDto;
import com.jee.clinichub.app.customer.service.CustomerService;
import com.jee.clinichub.global.model.Status;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/customer")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @Cacheable(value = "customerCache" , keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/list")
    public List<CustomerDto> getAllCustomeres(){
        return customerService.getAllCustomers();
    }
    
    
    @GetMapping(value="/id/{id}")
    public CustomerDto getById(@PathVariable Long id ){
        return customerService.getById(id);
    }
    
    @PostMapping(value="/search")
    public CustomerDto search(@RequestBody CustomerDto customer ){
        return customerService.search(customer);
    }
    
    
    @CacheEvict(value="customerCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value="/saveOrUpdate")
    @ResponseBody
    public Status saveCustomer(@RequestBody @Valid CustomerDto customer,HttpServletRequest request,Errors errors){
        return customerService.saveOrUpdate(customer);
    }
    
   
    @CacheEvict(value="customerCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
	@GetMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return customerService.deleteById(id);
    }

}
