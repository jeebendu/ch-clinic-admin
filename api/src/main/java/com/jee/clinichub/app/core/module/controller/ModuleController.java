package com.jee.clinichub.app.core.module.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.core.module.service.ModuleService;
import com.jee.clinichub.app.core.projections.CommonProj;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/module")
public class ModuleController {

    @Autowired
    private ModuleService moduleService;

    
    @GetMapping(value="/list")
    public List<CommonProj> getAllModules(){
        return moduleService.getAllModules();
    }
    
   /* 
    @GetMapping(value="/id/{id}")
    public SequenceDto getById(@PathVariable Long id ){
        return sequenceService.getById(id);
    }
    
    @GetMapping(value="/lastsequense/{branchId}")
    public SequenceDto getlastsequense(@PathVariable Long branchId){
        return sequenceService.getLastSequense(branchId);
    }
    
    @GetMapping(value="/nextsequense/{branchId}")
    public String getNextSequense(@PathVariable Long branchId){
        return sequenceService.getNextSequense(branchId,5L);
    }
    
    
    @CacheEvict(value="sequenceCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value="/saveOrUpdate")
    @ResponseBody
    public Status saveSequence(@RequestBody @Valid SequenceDto sequence,HttpServletRequest request,Errors errors){
        return sequenceService.saveOrUpdate(sequence);
    }
    
   
    @CacheEvict(value="sequenceCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
	@GetMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return sequenceService.deleteById(id);
    }*/

}
