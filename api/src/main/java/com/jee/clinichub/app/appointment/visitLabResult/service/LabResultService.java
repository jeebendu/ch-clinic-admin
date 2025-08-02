package com.jee.clinichub.app.appointment.visitLabResult.service;

import java.util.List;

import com.jee.clinichub.app.appointment.visitLabResult.model.LabResultDTO;
import com.jee.clinichub.global.model.Status;


public interface LabResultService {

    List<LabResultDTO> getAll();

    LabResultDTO getById(Long id);

    Status saveOrUpdate(LabResultDTO labResultDTO);

    Status deleteById(Long id);
    
}
