package com.jee.clinichub.app.core.country.service;

import java.util.List;

import com.jee.clinichub.app.core.country.model.CountryDto;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;

public interface CountrySv {

	List<CountryDto> getAllenquiryService();

	CountryDto getById(Long id);

	Status saveOrUpdate(@Valid CountryDto countryDto);

	Status deleteById(Long id);

}
