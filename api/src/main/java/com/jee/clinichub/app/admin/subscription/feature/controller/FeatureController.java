package com.jee.clinichub.app.admin.subscription.feature.controller;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.admin.subscription.feature.model.FeatureDto;
import com.jee.clinichub.app.admin.subscription.feature.service.FeatureService;
import com.jee.clinichub.app.admin.subscription.plan.model.PlanDto;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
@RestController
@RequestMapping(value = "/v1/feature")
@CrossOrigin(origins = "*",maxAge = 3600)
@RequiredArgsConstructor
public class FeatureController {

    private final FeatureService featureService;
   
     @Cacheable(value = "featureCache" , keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/list")
    public List<FeatureDto> getAllFeatures(){
        return featureService.getAllFeatures();
    }
    
    @Cacheable(value = "featureCache" , keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/id/{id}")
    public FeatureDto getById(@PathVariable Long id ){
        return featureService.getById(id);
    }
    
    
    @CacheEvict(value="featureCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value="/saveOrUpdate")
    public Status saveBranch(@RequestBody @Valid FeatureDto featureDto,HttpServletRequest request,Errors errors){
        return featureService.saveOrUpdate(featureDto);
    }
    
   
    @CacheEvict(value="featureCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
	@DeleteMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return featureService.deleteById(id);
    }
  
  
}
