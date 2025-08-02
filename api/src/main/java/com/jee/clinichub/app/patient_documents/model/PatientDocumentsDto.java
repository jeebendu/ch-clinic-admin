package com.jee.clinichub.app.patient_documents.model;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull;

import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.app.patient.model.PatientDto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@EqualsAndHashCode
@NoArgsConstructor
public class PatientDocumentsDto {
	private Long id;
	private PatientDto patient;
	
    private Date date;
	
	
	private String documentName;
	
	public PatientDocumentsDto(PatientDocuments patientDocuments){
		this.id=patientDocuments.getId();
	    this.date=patientDocuments.getDate();
	    this.documentName=patientDocuments.getDocumentName();
	    this.patient=new PatientDto(patientDocuments.getPatient()) ;
	}

}
