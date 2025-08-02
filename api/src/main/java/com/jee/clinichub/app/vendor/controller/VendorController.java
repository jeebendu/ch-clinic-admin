package com.jee.clinichub.app.vendor.controller;

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

import com.jee.clinichub.app.vendor.model.VendorDto;
import com.jee.clinichub.app.vendor.service.VendorService;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/vendor")
public class VendorController {

    @Autowired
    private VendorService vendorService;

    @Cacheable(value = "vendorCache" , keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/list")
    public List<VendorDto> getAllVendores(){
        return vendorService.getAllVendors();
    }
    
    
    @GetMapping(value="/id/{id}")
    public VendorDto getById(@PathVariable Long id ){
        return vendorService.getById(id);
    }
    
    
    @CacheEvict(value="vendorCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value="/saveOrUpdate")
    @ResponseBody
    public Status saveVendor(@RequestBody @Valid VendorDto vendor,HttpServletRequest request,Errors errors){
        return vendorService.saveOrUpdate(vendor);
    }
    
   
    @CacheEvict(value="vendorCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
	@GetMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return vendorService.deleteById(id);
    }

    @GetMapping("/gst-no/{gst}")
    public VendorDto findByGstNo(@PathVariable String gst){
        return vendorService.findByGst(gst);
    }


}
