package com.jee.clinichub.app.patient.audiometry.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.patient.model.PatientDto;
import com.jee.clinichub.config.audit.AuditableDto;
import com.jee.clinichub.global.utility.DateUtility;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AudiometryDto extends AuditableDto<String>{

	private Long id;
	private String uid;
	private BranchDto branch;
	private PatientDto patient;
	private Puretone puretoneLeft;
	private Puretone puretoneRight;
	private DataMap[] earLeft;
	private DataMap[] earRight;
	private DataMap[] testLeft;
	private DataMap[] testRight;
	private String impedanceAudiometry;
	private String proDiagnosisLeft;
	private String proDiagnosisRight;
	private String recommendation;
	private Modality modality;

	public AudiometryDto(Audiometry audiometry) {
		
		ObjectMapper om = new ObjectMapper();
		
		this.id = audiometry.getId();
		this.uid=audiometry.getUid();
		this.patient = new PatientDto(audiometry.getPatient());

		 try {
			this.puretoneLeft = om.readValue(audiometry.getPuretoneLeft(), Puretone.class);
			this.puretoneRight = om.readValue(audiometry.getPuretoneRight(), Puretone.class);
			this.earLeft = om.readValue(audiometry.getEarLeft(), DataMap[].class);
			this.earRight = om.readValue(audiometry.getEarRight(), DataMap[].class);
			this.testLeft = om.readValue(audiometry.getTestLeft(), DataMap[].class);
			this.testRight = om.readValue(audiometry.getTestRight(), DataMap[].class);
			this.modality =  (audiometry.getModality()!=null)?om.readValue(audiometry.getModality(), Modality.class):new Modality();
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		 
		 if(audiometry.getBranch()!=null){
				this.branch=new BranchDto(audiometry.getBranch());
			}
		
		this.impedanceAudiometry = audiometry.getImpedanceAudiometry();
		this.proDiagnosisLeft = audiometry.getProDiagnosisLeft();
		this.proDiagnosisRight = audiometry.getProDiagnosisRight();
		this.recommendation = audiometry.getRecommendation();
		this.setCreatedTime(DateUtility.convertToTargetTimeZone(DateUtility.dateToString(audiometry.getCreatedTime())));
		this.setModifiedTime(DateUtility.convertToTargetTimeZone(DateUtility.dateToString(audiometry.getModifiedTime())));

	}

}

//import com.fasterxml.jackson.databind.ObjectMapper; // version 2.11.1
//import com.fasterxml.jackson.annotation.JsonProperty; // version 2.11.1
/*
 * ObjectMapper om = new ObjectMapper(); Root root = om.readValue(myJsonString,
 * Root.class);
 */

@Data
class Dataset {
	private String label;
	private Integer value;

	

}

@Data
class DataMap {
	private String key;
	private String value;

	
}

@Data
class Puretone {
	private Dataset[] acu;
	private Dataset[] acm;
	private Dataset[] bcu;
	private Dataset[] bcm;
	private Dataset[] nor;
}

@Data
class Modality {
	private boolean acuChecked;
	private boolean acmChecked;
	private boolean bcuChecked;
	private boolean bcmChecked;
	private boolean norChecked;
}
