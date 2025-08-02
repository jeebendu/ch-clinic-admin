package com.jee.clinichub.app.core.district.service;

import java.util.List;

import com.jee.clinichub.app.core.district.model.DistrictDto;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;

public interface DistrictService {

    Status deleteById(Long id);

    Status saveOrUpdate(@Valid DistrictDto districtDto);

    List<DistrictDto> getByState_id(Integer id);

    List<DistrictDto> findAll();

    DistrictDto getById(Long id);

    List<DistrictDto> filterByName(String name);


    
}
