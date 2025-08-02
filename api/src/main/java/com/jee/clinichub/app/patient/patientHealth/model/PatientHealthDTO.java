package com.jee.clinichub.app.patient.patientHealth.model;

import com.jee.clinichub.app.patient.model.PatientDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PatientHealthDTO {
    private Long id;

    private PatientDto patientDto;
    
    private Long height;
    private Long weight;

    private String bloodGroup;
    private String allergies;

    private String currentMedication;

    private String bloodPressure;

    private String heartRate;

    private String cholesterol;

    private String bloodSugar;

    public PatientHealthDTO(PatientHealth health){
        this.id=health.getId();
        this.patientDto=new PatientDto(health.getPatient());
        this.height=health.getHeight();
        this.weight=health.getWeight();
        this.bloodGroup=health.getBloodGroup();
        this.allergies=health.getAllergies();
        this.currentMedication=health.getCurrentMedication();
        this.bloodPressure=health.getBloodPressure();
        this.heartRate=health.getHeartRate();
        this.cholesterol=health.getCholesterol();
        this.bloodSugar=health.getBloodSugar();
    }

}
