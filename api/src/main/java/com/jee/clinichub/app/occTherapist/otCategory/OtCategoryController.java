package com.jee.clinichub.app.occTherapist.otCategory;

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

import com.jee.clinichub.global.model.Status;



@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/ot/category")
public class OtCategoryController {

    @Autowired
    private OtCategoryService OtCategoryService;

    @Cacheable(value = "OtCategoryCache" , keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/list")
    public List<OtCategoryDto> getAllOtCategoryes(){
        return OtCategoryService.getAllOtCategorys();
    }
    
    
    @GetMapping(value="/id/{id}")
    public OtCategoryDto getById(@PathVariable Long id ){
        return OtCategoryService.getById(id);
    }
    
    
    
}
