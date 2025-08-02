package com.jee.clinichub.app.patient.audiometry.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.app.patient.audiometry.model.AudiometryDto;
import com.jee.clinichub.app.patient.audiometry.service.AudiometryService;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/patient/audiometry")
public class AudiometryController {

    @Autowired
    private AudiometryService audiometryService;

    @Cacheable(value = "audiometryCache" , keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/list")
    public List<AudiometryDto> getAllAudiometryes(){
        return audiometryService.getAllAudiometrys();
    }
    
    
    @GetMapping(value="/id/{id}")
    public AudiometryDto getById(@PathVariable Long id ){
        return audiometryService.getById(id);
    }
    
    @GetMapping(value="/patientId/{id}")
    public List<AudiometryDto> getByPatientId(@PathVariable Long id ){
        return audiometryService.getByPatientId(id);
    }
    
    
    @CacheEvict(value="audiometryCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value="/saveOrUpdate")
    @ResponseBody
    public Status saveAudiometry(@RequestBody @Valid AudiometryDto audiometry,HttpServletRequest request,Errors errors){
        return audiometryService.saveOrUpdate(audiometry);
    }
    
   
    @CacheEvict(value="audiometryCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
	@GetMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return audiometryService.deleteById(id);
    }
    
  //@CacheEvict(value="tenantCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping("/print/id/{id}")
    public ResponseEntity<byte[]> audiogramPrint(@PathVariable Long id ,
    		@RequestPart(value = "canvasChartLeftFile",required = true) MultipartFile canvasChartLeftFile,
    		@RequestPart(value = "canvasChartRightFile",required = true) MultipartFile canvasChartRightFile) {
    	
    	byte[] contents = audiometryService.audiogramPrint(canvasChartLeftFile,canvasChartRightFile,id);
    	HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        // Here you have to set the actual filename of your pdf
        String filename = "audiogram.pdf";
        headers.setContentDispositionFormData(filename, filename);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        ResponseEntity<byte[]> response = new ResponseEntity<>(contents, headers, HttpStatus.OK);
        return response;
        
    }

}
