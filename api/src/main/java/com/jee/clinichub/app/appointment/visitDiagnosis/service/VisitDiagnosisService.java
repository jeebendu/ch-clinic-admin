package com.jee.clinichub.app.appointment.visitDiagnosis.service;


import java.util.List;
import com.jee.clinichub.app.appointment.visitDiagnosis.model.VisitDiagnosisDto;
import com.jee.clinichub.global.model.Status;

public interface VisitDiagnosisService {

    List<VisitDiagnosisDto> getAllDiagnosis();

    VisitDiagnosisDto getById(Long id);

    Status deleteById(Long id);

    Status saveOrUpdate(VisitDiagnosisDto diagnosisDto);

    List<VisitDiagnosisDto> byVisitId(Long id);

}
