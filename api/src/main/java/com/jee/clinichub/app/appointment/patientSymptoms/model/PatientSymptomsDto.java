package com.jee.clinichub.app.appointment.patientSymptoms.model;

import com.jee.clinichub.app.appointment.symptoms.model.SymptomsDto;
import com.jee.clinichub.app.patient.schedule.model.ScheduleDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PatientSymptomsDto {
    
    private Long id;

    private ScheduleDto visit;

    private SymptomsDto symptoms;

    private String severity;

    public PatientSymptomsDto(PatientSymptoms symptoms) {
        if (symptoms != null) {
            this.id = symptoms.getId();
            this.visit = symptoms.getVisit() != null ? new ScheduleDto(symptoms.getVisit()) : null;
            this.symptoms = symptoms.getSymptoms() != null ? new SymptomsDto(symptoms.getSymptoms()) : null;
            this.severity = symptoms.getSeverity();
        }
    }

}
