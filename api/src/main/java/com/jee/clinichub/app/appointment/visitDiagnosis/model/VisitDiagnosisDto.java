package com.jee.clinichub.app.appointment.visitDiagnosis.model;



import com.jee.clinichub.app.appointment.diagnosis.model.DiagnosisDto;
import com.jee.clinichub.app.doctor.model.Doctor;
import com.jee.clinichub.app.patient.schedule.model.ScheduleDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class VisitDiagnosisDto {

	private Long id;
	private DiagnosisDto diagnosis;
	private ScheduleDto visit;
	private String diagnosisCode;
	private String description;
	private boolean primary;
	private Doctor diagnosedBy;

	public VisitDiagnosisDto(VisitDiagnosis diagnosis) {
		if(diagnosis.getId()!=null){
			this.id = diagnosis.getId();
		}
		this.diagnosis=new DiagnosisDto(diagnosis.getDiagnosis());
		this.description=diagnosis.getDescription();
		this.primary=diagnosis.isPrimary();
		this.diagnosedBy=diagnosis.getDiagnosedBy();
		this.diagnosisCode=diagnosis.getDiagnosisCode();
	}
}
