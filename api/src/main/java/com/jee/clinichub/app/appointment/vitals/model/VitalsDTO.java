package com.jee.clinichub.app.appointment.vitals.model;

import com.jee.clinichub.app.patient.schedule.model.ScheduleDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class VitalsDTO {
    
    private Long id;
    private ScheduleDto schedule;

    private Double temperature;
    private Double pulse;
    private Double respiratory;
    private Double spo2;
    private Double bloodPressure;
    private Double height;
    private Double weight;
    private Double waist;
    private Double bsa;
    private Double bmi;

    public VitalsDTO(Vitals vitals) {

        if(vitals.getId() != null) {
            this.id = vitals.getId();
        } 
        this.schedule = new ScheduleDto(vitals.getSchedule());
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
