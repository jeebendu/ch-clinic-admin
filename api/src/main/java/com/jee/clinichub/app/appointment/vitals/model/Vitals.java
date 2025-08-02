package com.jee.clinichub.app.appointment.vitals.model;


import java.io.Serializable;

import com.jee.clinichub.app.patient.schedule.model.Schedule;
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

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "visit_vitals")
public class Vitals extends Auditable<String> implements Serializable{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "visit_id", nullable = false)    
    private Schedule schedule;

    private Double temperature;
    private Double pulse;
    private Double respiratory;
    private Double spo2;
    @Column(name = "blood_pressure")
    private Double bloodPressure;

    private Double height;
    private Double weight;
    private Double waist;
    private Double bsa;
    private Double bmi;

    public Vitals(VitalsDTO vitals) {

        if(vitals.getId() != null) {
            this.id = vitals.getId();
        } 
        this.schedule = new Schedule(vitals.getSchedule());
        this.temperature = vitals.getTemperature();
        this.pulse = vitals.getPulse();
        this.respiratory = vitals.getRespiratory();
        this.spo2 = vitals.getSpo2();
        this.bloodPressure = vitals.getBloodPressure();
        this.height = vitals.getHeight();
        this.weight = vitals.getWeight();
        this.waist = vitals.getWaist();
        this.bsa = vitals.getBsa();
        this.bmi = vitals.getBmi();
    }

}
// vitals_id INT PRIMARY KEY,
// visit_id INT,
// temperature DECIMAL(4,1),
// blood_pressure VARCHAR(20),
// pulse INT,
// respiration_rate INT,
// recorded_at DATETIME,
// FOREIGN KEY (visit_id) REFERENCES Visits(visit_id)