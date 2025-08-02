package com.jee.clinichub.app.admin.clinic.clinicType.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicDto;
import com.jee.clinichub.app.admin.clinic.clinicType.model.ClinicTypeDto;
import com.jee.clinichub.app.admin.clinic.clinicType.service.ClinicTypeService;

import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;


@RestController
@Log4j2
@RequestMapping("/api/public/clinic-types")
public class ClinicTypePublicController {

	@Autowired
	private ClinicTypeService clinicTypeService;

	@GetMapping(value = "/list")
	public List<ClinicTypeDto> getAllClinicType() {
		return clinicTypeService.getAllClinicType();
	}

	

	@PostMapping(value = "/search")
	public List<ClinicTypeDto> filterType(@RequestBody(required = false) ClinicTypeDto search) {
	    log.info("Received ClinicType search request: {}", search);
	    List<ClinicTypeDto> response = clinicTypeService.filterType(search);
	    log.info("Search result size: {}", response != null ? response.size() : "null");
	    return response;
	}

}
