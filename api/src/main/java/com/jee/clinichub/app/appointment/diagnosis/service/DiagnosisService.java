package com.jee.clinichub.app.appointment.diagnosis.service;

import java.util.List;
import com.jee.clinichub.app.appointment.diagnosis.model.DiagnosisDto;
import com.jee.clinichub.global.model.Status;

public interface DiagnosisService {
    List<DiagnosisDto> findByName(DiagnosisDto filter);

    List<DiagnosisDto> getAllDiagnosis();

    DiagnosisDto getById(Long id);

    Status saveOrUpdate(DiagnosisDto diagnosisDto);

    Status deleteById(Long id);

}
