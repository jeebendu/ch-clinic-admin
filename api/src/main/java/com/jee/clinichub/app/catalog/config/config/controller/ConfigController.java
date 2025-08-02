package com.jee.clinichub.app.catalog.config.config.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.catalog.category.model.CategoryDto;
import com.jee.clinichub.app.catalog.config.config.model.Config;
import com.jee.clinichub.app.catalog.config.config.model.ConfigDto;
import com.jee.clinichub.app.catalog.config.config.service.ConfigService;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/catalog/config")
public class ConfigController {

    @Autowired
    private ConfigService configService;

     
    @GetMapping(value="/id/{id}")
    public ConfigDto getById(@PathVariable Long id ){
        return configService.getById(id);
    }



    // @Cacheable(value = "configCache", keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value = "/save")
    public Status saveImport(@RequestBody @Valid ConfigDto config,HttpServletRequest request,Errors errors) {
   
        return configService.save(config);
    }

    // @Cacheable(value = "configCache" , keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value = "/all")
    public ConfigDto getConfig(){
        return configService.getConfigList();
    }
    


   
}


