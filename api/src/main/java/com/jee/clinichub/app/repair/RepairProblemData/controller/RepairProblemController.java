package com.jee.clinichub.app.repair.RepairProblemData.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
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
import com.jee.clinichub.app.repair.RepairProblemData.model.RepairProblemDataDto;
import com.jee.clinichub.app.repair.RepairProblemData.service.RepairProblemService;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("v1/Repair/RepairProblemData")
public class RepairProblemController {
	
	 @Autowired
	    private RepairProblemService repairProblemService;
	 
	 
	    
	    @GetMapping(value="/list")
	    public List<RepairProblemDataDto> getAllRepairProblemData(){
	        return repairProblemService.getAllRepairProblemData();
	    }

	    @GetMapping(value="/id/{id}")
	    public RepairProblemDataDto getById(@PathVariable Long id ){
	        return repairProblemService.getById(id);
	    }
	    
	  
	    @PostMapping(value="/saveOrUpdate")
	    @ResponseBody
	    public Status saveRepairProblemData(@RequestBody @Valid RepairProblemDataDto repairProblemDataDto,HttpServletRequest request,Errors errors){
	        return repairProblemService.saveOrUpdate(repairProblemDataDto);
	    }
	    
	   
	    
		@GetMapping(value="/delete/id/{id}")
	    public Status deleteById(@PathVariable Long id ){
	        return repairProblemService.deleteById(id);
	    }
	    
	    @PostMapping("/print/id/{id}")
	    public ResponseEntity<byte[]> repairProblemDataPrint(@PathVariable Long id ,
	    		@RequestPart(value = "canvasChartLeftFile",required = true) MultipartFile canvasChartLeftFile,
	    		@RequestPart(value = "canvasChartRightFile",required = true) MultipartFile canvasChartRightFile) {
	    	
	    	byte[] contents = repairProblemService.repairProblemDataPrint(canvasChartLeftFile,canvasChartRightFile,id);
	    	HttpHeaders headers = new HttpHeaders();
	        headers.setContentType(MediaType.APPLICATION_PDF);
	        // Here you have to set the actual filename of your pdf
	        String filename = "repairProblemData.pdf";
	        headers.setContentDispositionFormData(filename, filename);
	        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
	        ResponseEntity<byte[]> response = new ResponseEntity<>(contents, headers, HttpStatus.OK);
	        return response;
	        
	    }
}
