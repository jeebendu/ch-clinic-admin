package com.jee.clinichub.app.catalog.category.controller;

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

import com.jee.clinichub.app.catalog.category.model.CategoryDto;
import com.jee.clinichub.app.catalog.category.service.CategoryService;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/catalog/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @Cacheable(value = "categoryCache" , keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/list")
    public List<CategoryDto> getAllCategorys(){
        return categoryService.getAllCategorys();
    }
    
    @Cacheable(value = "categoryCache",keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/id/{id}")
    public CategoryDto getById(@PathVariable Long id ){
        return categoryService.getById(id);
    }
    
    //@CachePut(cacheNames = "categoryCache", key="#p0")
    @CacheEvict(value="categoryCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value="/saveOrUpdate")
    public Status saveCategory(@RequestBody @Valid CategoryDto category,HttpServletRequest request,Errors errors){
        return categoryService.saveOrUpdate(category);
    }
    
   
    @CacheEvict(value="categoryCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
	@GetMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return categoryService.deleteById(id);
    }

}
