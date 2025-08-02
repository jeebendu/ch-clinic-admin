package com.jee.clinichub.app.core.cache;

import org.springframework.cache.CacheManager;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/cache")
public class CacheController {
	
	private final CacheManager cacheManager;
    
    @GetMapping("/clear")
    public String evictAllCaches() {
        cacheManager.getCacheNames().stream().forEach(cacheName -> {
        log.info(cacheName);
        cacheManager.getCache(cacheName).clear();}
        );
    	return "Cache clear successfully";
    }
    
    @GetMapping("/all")
    public String getAllCaches() {
        cacheManager.getCacheNames().stream().forEach(cacheName -> {
        log.info(cacheName);
        //cacheManager.getCache(cacheName).clear();
        }
        );
    	return "All Cache";
    }

}
