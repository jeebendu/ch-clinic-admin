package com.jee.clinichub.app.appointment.visitDiagnosis.model;


import java.io.Serializable;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.jee.clinichub.app.appointment.diagnosis.model.Diagnosis;
import com.jee.clinichub.app.doctor.model.Doctor;
import com.jee.clinichub.app.patient.schedule.model.Schedule;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
@Entity
@EqualsAndHashCode(callSuper = false)
@Table(name = "visit_diagnosis")
@EntityListeners(AuditingEntityListener.class)
public class VisitDiagnosis extends Auditable<String> implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne
	@JoinColumn(name = "diagnosis_id")
	private Diagnosis diagnosis;

	
    @JsonBackReference
	@ManyToOne
	@JoinColumn(name = "visit_id")
	private Schedule visit;
	@Column(name = "diagnosis_code")
	private String diagnosisCode;
	private String description;
	@Column(name = "is_primary")
	private boolean primary;

	@Column(name = "diagnosed_by_id")
	private Doctor diagnosedBy;

	public VisitDiagnosis(VisitDiagnosisDto diagnosis) {
		this.id = diagnosis.getId();
		this.diagnosis=new Diagnosis(diagnosis.getDiagnosis());
		this.description=diagnosis.getDescription();
		this.primary=diagnosis.isPrimary();
		this.diagnosedBy=diagnosis.getDiagnosedBy();
		this.diagnosisCode=diagnosis.getDiagnosisCode();
	}
}
