package com.jee.clinichub.app.appointment.visitLabOrder.service;

import java.util.List;

import com.jee.clinichub.app.appointment.visitLabOrder.model.LabOrderDTO;
import com.jee.clinichub.global.model.Status;

public interface LabOrderService {

    Status updateStatus(Long id);

    Status deleteById(Long id);

    Status saveOrUpdate(LabOrderDTO labOrderDTO);

    LabOrderDTO getById(Long id);

    List<LabOrderDTO> getAll();

    List<LabOrderDTO> findAllByPatientId(Long patientId);
    
}
