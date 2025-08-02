package com.jee.clinichub.app.patient_documents.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.app.patient_documents.model.PatientDocuments;
import com.jee.clinichub.app.patient_documents.model.PatientDocumentsDto;
import com.jee.clinichub.app.patient_documents.repository.PatientDocumentsRepository;
import com.jee.clinichub.global.model.Status;
@Service(value = "PatientDocumentsService")
public class PatientDocumentsServiceImpl implements PatientDocumentsService{
	
	private static final Logger log = LoggerFactory.getLogger(PatientDocumentsServiceImpl.class);
	@Autowired PatientDocumentsRepository patientDocumentsRepository;

	@Override
	public List<PatientDocumentsDto> getallDocuments() {
		List<PatientDocuments> patientDocumentsList=patientDocumentsRepository.findAll();
		List<PatientDocumentsDto> patientDocumentsDtolist= patientDocumentsList.stream().map(PatientDocumentsDto::new).collect(Collectors.toList());
		return patientDocumentsDtolist;
	}

	@Override
	public PatientDocumentsDto getById(Long id) {
		PatientDocumentsDto patientDocumentsDto = new PatientDocumentsDto();
		try{
			Optional<PatientDocuments> patientDocuments = patientDocumentsRepository.findById(id);
			if(patientDocuments.isPresent()){
				patientDocumentsDto = new PatientDocumentsDto(patientDocuments.get());
			}
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return patientDocumentsDto;
	}

	@Override
	public Status delelteById(Long id) {
		PatientDocumentsDto patientDocumentsDto = new PatientDocumentsDto();
		try{
			Optional<PatientDocuments> patientDocuments = patientDocumentsRepository.findById(id);
			
				
				if(!patientDocuments.isPresent()){
					return new Status(false,"Patient Not Found");
				}
				
				patientDocumentsRepository.deleteById(id);
				return new Status(true,"Deleted Successfully");
			}catch(Exception e){
				log.error(e.getLocalizedMessage());
			}
			return new Status(false,"Something went wrong");
	}

	@Override
	public Status saveOrupdate(PatientDocumentsDto patientDocumentsDto) {
		PatientDocuments patientDocuments =new PatientDocuments();
	try {
		if(patientDocumentsDto.getId()==null) {
			patientDocuments=new PatientDocuments(patientDocumentsDto);
		}else{
			patientDocuments = this.setPatientDocuments(patientDocumentsDto);
		}
		patientDocuments = patientDocumentsRepository.save(patientDocuments);
		return new Status(true,( (patientDocumentsDto.getId()==null) ? "Added":"Updated")  +  " Successfully");
	}catch(Exception e){
		log.error(e.getLocalizedMessage());
	}
	return new Status(false,"Something went wrong");
	}

	private PatientDocuments setPatientDocuments(PatientDocumentsDto patientDocumentsDto) {
		PatientDocuments exPatientDocuments = patientDocumentsRepository.findById(patientDocumentsDto.getId()).get();
		exPatientDocuments.setDate(patientDocumentsDto.getDate());
		exPatientDocuments.setDocumentName(patientDocumentsDto.getDocumentName());
		exPatientDocuments.setPatient(new Patient(patientDocumentsDto.getPatient()));
		return exPatientDocuments;
	}

	@Override
	public PatientDocumentsDto getByPId(Long id) {
		PatientDocumentsDto patientDocumentsDto = new PatientDocumentsDto();
		try{
			Optional<PatientDocuments> patientDocuments = patientDocumentsRepository.findByPatient_id(id);
			if(patientDocuments.isPresent()){
				patientDocumentsDto = new PatientDocumentsDto(patientDocuments.get());
			}
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return patientDocumentsDto;
	}

}
