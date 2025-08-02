package com.jee.clinichub.app.user.logininfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;


@RestController
@RequiredArgsConstructor
@RequestMapping("v1/login")
public class LogInfoController {
    
     @Autowired
    private LoginInfoService logInfoService;

     @Cacheable(value = "logInfoCache" , keyGenerator = "multiTenantCacheKeyGenerator")
      @PostMapping(value="/filter/{page}/{size}")
    public Page<LogInfo> getLoginPage(@PathVariable int page, @PathVariable  int size,@RequestBody  LoginSearch search){
        return logInfoService.getLoginPage(page,size,search);
    }
}
