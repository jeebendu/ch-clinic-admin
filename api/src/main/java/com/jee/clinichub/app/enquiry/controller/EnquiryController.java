package com.jee.clinichub.app.enquiry.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jee.clinichub.app.core.DataImport;
import com.jee.clinichub.app.core.status.model.StatusDTO;
import com.jee.clinichub.app.enquiry.model.EnquiryDto;
import com.jee.clinichub.app.enquiry.model.EnquiryFilter;
import com.jee.clinichub.app.enquiry.model.EnquiryProj;
import com.jee.clinichub.app.enquiry.service.EnquiryService;
import com.jee.clinichub.global.model.SearchObj;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/enquiry")
public class EnquiryController {

    @Autowired
    private EnquiryService enquiryService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    
    @GetMapping(value="/dashboard")
    public List<StatusDTO> getDashboardCount(){
        return enquiryService.getDashboardCount();
    }

    
    @GetMapping(value="/list")
    public List<EnquiryDto> getAllEnquiryes(){
        return enquiryService.getAllEnquirys();
    }
    

    
    @GetMapping(value="/id/{id}")
    public EnquiryDto getById(@PathVariable Long id ){
        return enquiryService.getById(id);
    }
    
    
    @CacheEvict(value="enquiryCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value="/saveOrUpdate")
    @ResponseBody
    public Status saveEnquiry(@RequestBody @Valid EnquiryDto enquiry,HttpServletRequest request,Errors errors){
        return enquiryService.saveOrUpdate(enquiry);
    }
    
   
    @CacheEvict(value="enquiryCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
	@GetMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return enquiryService.deleteById(id);
    }

  

    @PostMapping(value="/list/{page}/{size}")
    public Page<EnquiryProj> getPatientespage(@PathVariable int page, @PathVariable  int size,@RequestBody  SearchObj search){
        return enquiryService.getEnquiriesPage(page,size,search);
    }
    
    @GetMapping(value="/datalist/staffId/{sid}/{page}/{size}")
    public Page<EnquiryProj> getPatientespageBySid(@PathVariable int page, @PathVariable  int size,@PathVariable  Long sid){
        return enquiryService.getPatientespageBySid(page,size,sid);
    }
    
    @CacheEvict(value="enquiryCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping("/import")
    public Status handleFileUpload(
        @RequestParam("file") MultipartFile file,
        @RequestParam("dataImport") String dataImportJson) {
        try {
        // Convert JSON string to POJO
        DataImport dataImport = objectMapper.readValue(dataImportJson, DataImport.class);
        return enquiryService.importData(file,dataImport);
        } catch (Exception e) {
        	return new Status(false, "Something went wrong");
        }
    }

}
