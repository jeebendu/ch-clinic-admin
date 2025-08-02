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

import com.jee.clinichub.app.admin.clinic.clinicType.model.ClinicTypeDto;
import com.jee.clinichub.app.admin.clinic.clinicType.service.ClinicTypeService;

import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "*",maxAge = 3600)
@RequestMapping("/api/clinic-types")
public class ClinicTypeController {

	@Autowired
	private ClinicTypeService clinicTypeService;

	@GetMapping(value = "/list")
	public List<ClinicTypeDto> getAllClinicType() {
		return clinicTypeService.getAllClinicType();
	}

	@GetMapping(value = "/id/{id}")
	public ClinicTypeDto getById(@PathVariable Long id) {
		return clinicTypeService.getById(id);
	}

	@PostMapping(value = "/saveOrUpdate")
	public Status saveEnquiry(@RequestBody @Valid ClinicTypeDto clinicTypeDto, HttpServletRequest request,
			Errors errors) {
		return clinicTypeService.saveOrUpdate(clinicTypeDto);
	}

	@GetMapping(value = "/delete/id/{id}")
	public Status deleteById(@PathVariable Long id) {
		return clinicTypeService.deleteById(id);
	}

}
