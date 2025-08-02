package com.jee.clinichub.app.enquiryService.service;

import java.util.List;

import com.jee.clinichub.app.enquiryService.model.EnquiryServiceTypeDto;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;

public interface EnquiryServiceTypeSv {

	List<EnquiryServiceTypeDto> getAllenquiryService();

	EnquiryServiceTypeDto getById(Long id);

	Status saveOrUpdate(@Valid  EnquiryServiceTypeDto enquiryServiceTypeDto);

	Status deleteById(Long id);

	
}
