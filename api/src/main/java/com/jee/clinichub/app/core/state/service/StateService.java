package com.jee.clinichub.app.core.state.service;

import java.util.List;

import com.jee.clinichub.app.core.state.model.StateDto;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;

public interface StateService {

    List<StateDto> findAll();

    StateDto getById(Long id);

   

    Status saveOrUpdate(@Valid StateDto stateDto);

    Status deleteById(Long id);

    List<StateDto> getByCountryId(Long cid);
    
}
