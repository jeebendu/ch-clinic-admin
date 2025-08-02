package com.jee.clinichub.app.patient.patientHealth.model;

import java.io.Serializable;

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

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "patient_health")
public class PatientHealth extends Auditable<String> implements Serializable{
    
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "patient_id",nullable = false)
    private Patient patient;
    
    private Long height;
    private Long weight;

    @Column(name="blood_group")
    private String bloodGroup;
    private String allergies;

    @Column(name="current_medication")
    private String currentMedication;

    @Column(name="blood_pressure")
    private String bloodPressure;

    @Column(name="heart_rate")
    private String heartRate;

    private String cholesterol;

    @Column(name="blood_sugar")
    private String bloodSugar;

     public PatientHealth(PatientHealthDTO healthDTO){
        this.id=healthDTO.getId();
        this.patient=new Patient(healthDTO.getPatientDto());
        this.height=healthDTO.getHeight();
        this.weight=healthDTO.getWeight();
        this.bloodGroup=healthDTO.getBloodGroup();
        this.allergies=healthDTO.getAllergies();
        this.currentMedication=healthDTO.getCurrentMedication();
        this.bloodPressure=healthDTO.getBloodPressure();
        this.heartRate=healthDTO.getHeartRate();
        this.cholesterol=healthDTO.getCholesterol();
        this.bloodSugar=healthDTO.getBloodSugar();
       
    }
}
