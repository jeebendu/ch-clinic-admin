package com.jee.clinichub.app.admin.clinic.clinicHoliday.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.admin.clinic.clinicHoliday.model.ClinicHolidayDto;
import com.jee.clinichub.app.admin.clinic.clinicHoliday.service.ClinicHolidayService;
import com.jee.clinichub.global.model.Status;

@CrossOrigin(origins = "*",maxAge = 3600)
@RestController
@RequestMapping("/v1/api/clinic-holidday")
public class ClinicHolidaycontroller {


@Autowired
private ClinicHolidayService cHolidayService;
    

  
    @GetMapping(value="/list")
    public List<ClinicHolidayDto> getAllHoliday(){
        return cHolidayService.getAllHoliday();
    }
    
    
    @GetMapping(value="/id/{id}")
    public ClinicHolidayDto getById(@PathVariable Long id ){
        return cHolidayService.getById(id);
    }
    
    
    
    @PostMapping(value="/saveOrUpdate")
    public Status saveBranch(@RequestBody ClinicHolidayDto holidayDto){
        return cHolidayService.saveOrUpdate(holidayDto);
    }
    
   
   
	@DeleteMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return cHolidayService.deleteById(id);
    }
    
    @GetMapping( path="/branch/id/{id}")
	public List<ClinicHolidayDto> getByPostEdit(@PathVariable Long id){
		return cHolidayService.getByBranchId(id);
	}



}