package com.jee.clinichub.app.catalog.type.controller;

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

import com.jee.clinichub.app.catalog.type.model.ProductTypeDto;
import com.jee.clinichub.app.catalog.type.service.ProductTypeService;
import com.jee.clinichub.global.model.Status;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/catalog/type")
public class ProductTypeController {

    @Autowired
    private ProductTypeService productTypeService;

    @Cacheable(value = "productTypeCache" , keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/list")
    public List<ProductTypeDto> getAllProductTypees(){
        return productTypeService.getAllProductTypes();
    }
    
    @Cacheable(value = "productTypeCache",keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/id/{id}")
    public ProductTypeDto getById(@PathVariable Long id ){
        return productTypeService.getById(id);
    }
    
    
    @CacheEvict(value="productTypeCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value="/saveOrUpdate")
    @ResponseBody
    public Status saveProductType(@RequestBody @Valid ProductTypeDto productType,HttpServletRequest request,Errors errors){
        return productTypeService.saveOrUpdate(productType);
    }
    
   
    @CacheEvict(value="productTypeCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
	@GetMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return productTypeService.deleteById(id);
    }

}
