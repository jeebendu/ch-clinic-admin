package com.jee.clinichub.app.doctor.percentage.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import com.jee.clinichub.app.doctor.percentage.model.PercentageDTO;
import com.jee.clinichub.app.doctor.percentage.service.PercentageService;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("v1/percentage")
public class PercentageController {
    
    @Autowired
    private PercentageService percentageService;
    
	 @GetMapping(value="/list")
	    public List<PercentageDTO> getAllPercentage(){
	        return percentageService.getAllPercentage();
	    }
		
	 @GetMapping(value="/id/{id}")
	    public PercentageDTO getById(@PathVariable Long id ){
	        return percentageService.getById(id);
	    }

		@GetMapping(value="/doctor/id/{id}")
	    public List<PercentageDTO> getPercentageByDoctorId(@PathVariable Long id ){
	        return percentageService.getPercentageByDoctorId(id);
	    }

	    @PostMapping(value="/saveOrUpdate")
	    @ResponseBody
	    public Status saveEnquiry(@RequestBody @Valid PercentageDTO enquiryServiceTypeDto,HttpServletRequest request,Errors errors){
	        return percentageService.saveOrUpdate(enquiryServiceTypeDto);
	    }
	 
		@GetMapping(value="/delete/id/{id}")
	    public Status deleteById(@PathVariable Long id ){
	        return percentageService.deleteById(id);
	    }

		// find by id and EnqueryService name propertity
		@GetMapping(value="/id/{id}/name/{name}")
		public List<PercentageDTO> findByIdAndEnquaryName(@PathVariable("id") Long id,@PathVariable("name") String name){
			return percentageService.findByIdAndEnquiryServiceTypeName(id,name);
		}

}
