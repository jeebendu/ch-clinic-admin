package com.jee.clinichub.app.enquiryService.controler;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.enquiryService.model.EnquiryServiceTypeDto;
import com.jee.clinichub.app.enquiryService.service.EnquiryServiceTypeSv;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("v1/enquiryServiceType")


public class EnquiryServiceTypeController {

    @Autowired
    private EnquiryServiceTypeSv enquiryServiceTypeSv;
    
	 @GetMapping(value="/list")
	    public List<EnquiryServiceTypeDto> getAllEnquiryService(){
	        return enquiryServiceTypeSv.getAllenquiryService();
	    }
	 
	 
	 @GetMapping(value="/id/{id}")
	    public EnquiryServiceTypeDto getById(@PathVariable Long id ){
	        return enquiryServiceTypeSv.getById(id);
	    }
	 
	 
	 @CacheEvict(value="enquiryServiceCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
	    @PostMapping(value="/saveOrUpdate")
	    @ResponseBody
	    public Status saveEnquiry(@RequestBody @Valid EnquiryServiceTypeDto enquiryServiceTypeDto,HttpServletRequest request,Errors errors){
	        return enquiryServiceTypeSv.saveOrUpdate(enquiryServiceTypeDto);
	    }
	 
	 @CacheEvict(value="enquiryServiceCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
		@GetMapping(value="/delete/id/{id}")
	    public Status deleteById(@PathVariable Long id ){
	        return enquiryServiceTypeSv.deleteById(id);
	    }
	 
	 
	 
	
	 
	     
	    

}
