package com.jee.clinichub.app.occTherapist.otSubCategory;

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
@RequestMapping("v1/ot/subCategory")
public class OtSubCategoryController {

    @Autowired
    private OtSubCategoryService OtSubCategoryService;

    @Cacheable(value = "OtSubCategoryCache" , keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/list")
    public List<OtSubCategoryDto> getAllOtSubCategoryes(){
        return OtSubCategoryService.getAllOtSubCategorys();
    }
    
    
    @GetMapping(value="/id/{id}")
    public OtSubCategoryDto getById(@PathVariable Long id ){
        return OtSubCategoryService.getById(id);
    }
    
    @GetMapping(value = "/categoryid/{id}")
    public List<OtSubCategoryDto> getByCategoryId(@PathVariable Long id ) {
    return OtSubCategoryService.getByCategoryId(id);
    }
    
}
