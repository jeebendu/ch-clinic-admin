package com.jee.clinichub.app.catalog.batch.controller;

import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.catalog.batch.model.BatchDto;
import com.jee.clinichub.app.catalog.batch.service.BatchService;

import com.jee.clinichub.global.model.Status;

@RestController
@RequestMapping("v1/catalog/batch")
public class BatchController {

	 @Autowired
	    private BatchService batchService;
	 
	   @GetMapping(value="/list")
	    public List<BatchDto> getAllBatch(){
	        return batchService.getAllBatch();
	    }
	   
	   @GetMapping(value="/productId/{productId}")
	    public List<BatchDto> getAllBatchByProductId(@PathVariable Long productId ){
	        return batchService.getAllBatchByProductId(productId);
	    }
	    
	    @Cacheable(value = "batchCache",keyGenerator = "multiTenantCacheKeyGenerator")
	    @GetMapping(value="/id/{id}")
	    public BatchDto getById(@PathVariable Long id ){
	        return batchService.getById(id);
	    }
	    
	    
	    @CacheEvict(value="batchCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
	    @PostMapping(value="/saveOrUpdate")
	    @ResponseBody
	    public Status saveBrand(@RequestBody @Valid BatchDto BatchDto,HttpServletRequest request,Errors errors){
	        return batchService.saveOrUpdate(BatchDto);
	    }
	    
	   
	    @CacheEvict(value="batchCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
		@GetMapping(value="/delete/id/{id}")
	    public Status deleteById(@PathVariable Long id ){
	        return batchService.deleteById(id);
	    }
}
