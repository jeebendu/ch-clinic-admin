package com.jee.clinichub.app.patient.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;

import com.jee.clinichub.app.core.model.Search;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.app.patient.model.PatientDto;
import com.jee.clinichub.app.patient.model.PatientOptProj;
import com.jee.clinichub.app.patient.model.PatientProj;
import com.jee.clinichub.app.patient.model.PatientSearch;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;

public interface PatientService {
	
	Patient findByName(String name);

    PatientDto getById(Long id);

	Status deleteById(Long id);

	Status saveOrUpdate(PatientDto patientDto);

	List<PatientProj> getAllPatients();

	List<PatientOptProj> searchPatient(Search search);

	List<PatientProj> getAllPatients(Search search);
	
	Page<PatientProj> getPatientsPage(int page, int size, String search);

	Status changeBranch(Long[] patientIds,Long branchId);

    Page<PatientProj> search(PatientSearch patientSearch, int pageNo, int pageSize);

    Status registerPatients(PatientDto patient);

    Patient getMyProfile();

    Page<PatientProj> adminFilter(PatientSearch patientSearch, int pageNo, int pageSize);

	Patient findPatientByGlobalId(UUID globalPatientId);

    List<PatientDto> getPatientsPhoneByEmail(String phone);

	Object generatePatientQRCode(PatientDto patient);

    

	

}
