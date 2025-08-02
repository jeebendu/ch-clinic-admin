package com.jee.clinichub.app.appointment.vitals.service;

import java.util.List;

import com.jee.clinichub.app.appointment.vitals.model.Vitals;
import com.jee.clinichub.app.appointment.vitals.model.VitalsDTO;
import com.jee.clinichub.global.model.Status;

public interface VitalsService {

    Vitals getVitalsByVisitId(Long id);

    Status deleteById(Long id);

    Status saveOrUpdate(VitalsDTO vital);

    VitalsDTO getById(Long id);

    List<VitalsDTO> getAllVitals();


}
