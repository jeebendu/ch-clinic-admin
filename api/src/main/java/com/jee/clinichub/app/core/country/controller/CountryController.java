package com.jee.clinichub.app.core.country.controller;

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

import com.jee.clinichub.app.core.country.model.CountryDto;
import com.jee.clinichub.app.core.country.service.CountrySv;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("v1/country")
public class CountryController {
	  @Autowired
	    private CountrySv countrySv;
	  
	  @GetMapping(value="/list")
	    public List<CountryDto> getAllEnquiryService(){
	        return countrySv.getAllenquiryService();
	    }
	  
	  @GetMapping(value="/id/{id}")
	    public CountryDto getById(@PathVariable Long id ){
	        return countrySv.getById(id);
	    }
	  
	  @CacheEvict(value="countryCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
	    @PostMapping(value="/saveOrUpdate")
	    @ResponseBody
	    public Status saveEnquiry(@RequestBody @Valid CountryDto countryDto,HttpServletRequest request,Errors errors){
	        return countrySv.saveOrUpdate(countryDto);
	    }
	  
	  @CacheEvict(value="countryCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
		@GetMapping(value="/delete/id/{id}")
	    public Status deleteById(@PathVariable Long id ){
	        return countrySv.deleteById(id);
	    }
	  
	  
	 

}
