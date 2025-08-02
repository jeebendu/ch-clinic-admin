package com.jee.clinichub.app.patient.audiometry.model;

import java.io.Serializable;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * The persistent class for the role database table.
 * 
 */
@Data
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
@Entity
@Table(name = "patient_diagnosis_audiogram")
@EntityListeners(AuditingEntityListener.class)
public class Audiometry extends Auditable<String>  implements Serializable {
	

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	@Column(name = "uid", length = 50)
	private String uid;
	
	@OneToOne(cascade = CascadeType.MERGE)
	@JoinColumn(name = "branch_id", nullable = false)
	private Branch branch;
	
	@OneToOne
	@JoinColumn(name = "patient_id", nullable = false)
	private Patient patient;
	
	@Column(name="puretone_left")
	private String puretoneLeft="";
	
	@Column(name="puretone_right")
	private String puretoneRight="";
	
	@Column(name="ear_left")
	private String earLeft;
	
	@Column(name="ear_right")
	private String earRight;
	
	@Column(name="test_right")
	private String testRight;
	
	@Column(name="test_left")
	private String testLeft;
	
	@Column(name="impedance_audiometry")
	private String impedanceAudiometry;
	
	@Column(name="pro_diagnosis_left")
	private String proDiagnosisLeft;
	
	@Column(name="pro_diagnosis_right")
	private String proDiagnosisRight;
	
	@Column(name="recommendation")
	private String recommendation;
	
	@Column(name="modality")
	private String modality;
	
	
	public Audiometry(AudiometryDto audiometryDto) {
		super();
		ObjectMapper mapper = new ObjectMapper();
		this.id=audiometryDto.getId();
		
		if(audiometryDto.getBranch()!=null){
			this.branch=new Branch(audiometryDto.getBranch());
		}
		
		try {
			this.puretoneLeft = mapper.writeValueAsString(audiometryDto.getPuretoneLeft());
			this.puretoneRight = mapper.writeValueAsString(audiometryDto.getPuretoneRight());
			this.earLeft = mapper.writeValueAsString(audiometryDto.getEarLeft());
			this.earRight = mapper.writeValueAsString(audiometryDto.getEarRight());
			this.testLeft = mapper.writeValueAsString(audiometryDto.getTestLeft());
			this.testRight = mapper.writeValueAsString(audiometryDto.getTestRight());
			this.modality = mapper.writeValueAsString(audiometryDto.getModality());
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		this.impedanceAudiometry = audiometryDto.getImpedanceAudiometry();
		this.proDiagnosisLeft = audiometryDto.getProDiagnosisLeft();
		this.proDiagnosisRight = audiometryDto.getProDiagnosisRight();
		this.recommendation = audiometryDto.getRecommendation();
		
		
	}
	

	

	
}