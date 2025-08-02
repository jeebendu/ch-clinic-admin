package com.jee.clinichub.app.appointment.visitMedicines.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.patient.schedule.model.Schedule;
import com.jee.clinichub.app.patient.schedule.model.ScheduleDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.Date;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MedicinesDTO {
    
    private Long id;
    private String name;
    private String dosage;
    private String frequency;
    private String duration;
    private String timings;
    private String instruction;
    private ScheduleDto visit;

    // private PrescriptionDTO prescription;

    public MedicinesDTO(Medicines medicine){

        if(medicine.getId()!=null){
            this.id=medicine.getId();
        }
        this.name=medicine.getName();
        this.dosage=medicine.getDosage();
        this.frequency=medicine.getFrequency();
        this.duration=medicine.getDuration();
        this.timings=medicine.getTimings();
        this.instruction=medicine.getInstruction();
    }
}
