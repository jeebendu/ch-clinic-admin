package com.jee.clinichub.app.core.status.service;
import java.util.List;

import com.jee.clinichub.app.core.status.model.StatusDTO;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;

public interface StatusService {

    Status deleteById(Long id);

    Status saveOrUpdate(@Valid StatusDTO sourceDTO);

    StatusDTO getById(Long id);

    List<StatusDTO> getAllBranches();

}
