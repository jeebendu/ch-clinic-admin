package com.jee.clinichub.app.core.sequence.controller;

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

import com.jee.clinichub.app.core.sequence.model.SequenceDto;
import com.jee.clinichub.app.core.sequence.model.SequenceProj;
import com.jee.clinichub.app.core.sequence.service.SequenceService;
import com.jee.clinichub.global.model.Status;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/sequence")
public class SequenceController {

    @Autowired
    private SequenceService sequenceService;

    
    @GetMapping(value="/list")
    public List<SequenceProj> getAllSequencees(){
        return sequenceService.getAllSequences();
    }
    
    
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
    }

}
