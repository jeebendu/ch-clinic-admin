package com.jee.clinichub.app.patient_documents.model;

import java.io.Serializable;
import java.util.Date;

import org.hibernate.annotations.DynamicUpdate;

import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
@Entity
@Table(name = "patient_document")
public class PatientDocuments extends Auditable<String>  implements Serializable{

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	@OneToOne
	@JoinColumn(name = "patient_id", nullable = false)
	private Patient patient;
	
	@Column(name = "date")
	private Date date;
	
	@Column(name = "document_name")
	private String documentName;
	
	public PatientDocuments(PatientDocumentsDto patientDocumentsDto){
		this.id=patientDocumentsDto.getId();
	    this.date=patientDocumentsDto.getDate();
	    this.documentName=patientDocumentsDto.getDocumentName();
	    this.patient=new Patient(patientDocumentsDto.getPatient()) ;
	}

}
