package com.jee.clinichub.app.patient_documents.service;

import java.util.List;

import com.jee.clinichub.app.patient_documents.model.PatientDocumentsDto;
import com.jee.clinichub.global.model.Status;

public interface PatientDocumentsService {

	List<PatientDocumentsDto> getallDocuments();

	PatientDocumentsDto getById(Long id);

	Status delelteById(Long id);

	Status saveOrupdate(PatientDocumentsDto patientDocumentsDto);

	PatientDocumentsDto getByPId(Long id);

}
