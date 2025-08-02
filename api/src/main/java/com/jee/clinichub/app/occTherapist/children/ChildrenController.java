package com.jee.clinichub.app.occTherapist.children;

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

import com.fasterxml.jackson.annotation.JacksonInject.Value;
import com.jee.clinichub.app.occTherapist.ChildrenReport.ChildrenReport;
import com.jee.clinichub.app.occTherapist.otCategory.OtCategoryDto;
import com.jee.clinichub.global.model.Status;



@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/children")
public class ChildrenController {

    @Autowired
    private ChildrenService childrenService;

    @Cacheable(value = "childrenCache" , keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/list")
    public List<ChildrenDto> getAllChildrenes(){
        return childrenService.getAllChildrens();
    }
    
    
    @GetMapping(value="/id/{id}")
    public ChildrenDto getById(@PathVariable Long id ){
        return childrenService.getById(id);
    }
    
    @GetMapping(value = "/calculateIdp/{id}")
    public ChildrenReport getCategory(@PathVariable Long id) {
    	 return childrenService.getCategory(id);
    }
    
    @GetMapping(value="/id/{cid}/subCategory/{sid}") 
    public ChildrenDto getByChildrenMapping(@PathVariable Long cid , @PathVariable Long sid){
    	 return childrenService.getByChildrenMapping(cid ,sid);
	}
    

    @PostMapping(value="/saveSummary") 
    public Status saveChildrenSummary(@RequestBody @Valid ChildrenDto children,HttpServletRequest request,Errors errors){
    	 return childrenService.saveChildrenSummary(children);
	}
    
    @PostMapping(value="/saveOrUpdateCheckList") 
    public Status saveChildrenMapping(@RequestBody @Valid ChildrenDto children,HttpServletRequest request,Errors errors){
    	 return childrenService.saveByChildrenMapping(children);
	}
    
   // @CacheEvict(value="childrenCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value="/saveOrUpdate")
    @ResponseBody
    public Status saveChildren(@RequestBody @Valid ChildrenDto children,HttpServletRequest request,Errors errors){
        return childrenService.saveOrUpdate(children);
    }
    
   
    @CacheEvict(value="childrenCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
	@GetMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return childrenService.deleteById(id);
    }
}
