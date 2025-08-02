package com.jee.clinichub.app.core.source.service;

import java.util.List;

import com.jee.clinichub.app.core.source.model.SourceDTO;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;

public interface SourceService {

    Status deleteById(Long id);

    Status saveOrUpdate(@Valid SourceDTO sourceDTO);

    SourceDTO getById(Long id);

    List<SourceDTO> getAllBranches();
    

    
}