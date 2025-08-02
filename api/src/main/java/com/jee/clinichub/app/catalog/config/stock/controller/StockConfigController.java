package com.jee.clinichub.app.catalog.config.stock.controller;

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

import com.jee.clinichub.app.catalog.config.stock.model.StockConfigDto;
import com.jee.clinichub.app.catalog.config.stock.service.StockConfigService;
import com.jee.clinichub.global.model.Status;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/stockConfig")
public class StockConfigController {

    @Autowired
    private StockConfigService stockConfigService;

    @Cacheable(value = "stockConfigCache" , keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/list")
    public List<StockConfigDto> getAllStockConfiges(){
        return stockConfigService.getAllStockConfigs();
    }
    
    
    @GetMapping(value="/id/{id}")
    public StockConfigDto getById(@PathVariable Long id ){
        return stockConfigService.getById(id);
    }
    
    
    @CacheEvict(value="stockConfigCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value="/saveOrUpdate")
    @ResponseBody
    public Status saveStockConfig(@RequestBody @Valid StockConfigDto stockConfig,HttpServletRequest request,Errors errors){
        return stockConfigService.saveOrUpdate(stockConfig);
    }
    
   
    @CacheEvict(value="stockConfigCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
	@GetMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return stockConfigService.deleteById(id);
    }

}
