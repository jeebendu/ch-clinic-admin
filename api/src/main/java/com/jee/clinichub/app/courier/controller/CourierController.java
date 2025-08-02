package com.jee.clinichub.app.courier.controller;

import java.util.List;

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

import com.jee.clinichub.app.courier.model.CourierDto;
import com.jee.clinichub.app.courier.service.CourierService;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/courier")
public class CourierController {

    @Autowired
    private CourierService courierService;

    @Cacheable(value = "courierCache" , keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/list")
    public List<CourierDto> getAllCourieres(){
        return courierService.getAllCouriers();
    }
    
    
    @GetMapping(value="/id/{id}")
    public CourierDto getById(@PathVariable Long id ){
        return courierService.getById(id);
    }
    
    
    @CacheEvict(value="courierCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value="/saveOrUpdate")
    @ResponseBody
    public Status saveCourier(@RequestBody @Valid CourierDto courier,HttpServletRequest request,Errors errors){
        return courierService.saveOrUpdate(courier);
    }
    
   
    @CacheEvict(value="courierCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
	@GetMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return courierService.deleteById(id);
    }

}
