package com.jee.clinichub.app.catalog.brand.controller;

import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.catalog.brand.model.Brand;
import com.jee.clinichub.app.catalog.brand.model.BrandDto;
import com.jee.clinichub.app.catalog.brand.model.Search;
import com.jee.clinichub.app.catalog.brand.service.BrandService;
import com.jee.clinichub.app.patient.model.PatientProj;
import com.jee.clinichub.app.patient.model.PatientSearch;
import com.jee.clinichub.global.model.Status;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/catalog/brand")
public class BrandController {

    @Autowired
    private BrandService brandService;

    @Cacheable(value = "brandCache" , keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/list")
    public List<BrandDto> getAllBrandes(){
        return brandService.getAllBrands();
    }
    
    @Cacheable(value = "brandCache",keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/id/{id}")
    public BrandDto getById(@PathVariable Long id ){
        return brandService.getById(id);
    }
    
    
    @CacheEvict(value="brandCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value="/saveOrUpdate")
    @ResponseBody
    public Status saveBrand(@RequestBody @Valid BrandDto brand,HttpServletRequest request,Errors errors){
        return brandService.saveOrUpdate(brand);
    }
    
   
    @CacheEvict(value="brandCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
	@GetMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return brandService.deleteById(id);
    }

    // @CacheEvict(value="brandCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value="/filter/{pageNo}/{pageSize}")
    public Page<Brand> search(@RequestBody Search brandSearch,@PathVariable int pageNo,@PathVariable int pageSize){
        return brandService.search(brandSearch,pageNo,pageSize);
    }
}
