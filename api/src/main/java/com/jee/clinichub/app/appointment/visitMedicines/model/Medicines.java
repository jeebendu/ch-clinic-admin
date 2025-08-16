package com.jee.clinichub.app.appointment.visitMedicines.model;


import java.io.Serializable;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.jee.clinichub.app.patient.schedule.model.Schedule;
import com.jee.clinichub.config.audit.Auditable;

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
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
@Entity
@Table(name = "visit_medicines")
@EntityListeners(AuditingEntityListener.class)
public class Medicines extends Auditable<String>  implements Serializable{

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String dosage;
    private String frequency;
    private String duration;
    private String timings;
    private String instructions;
    

    
    @JsonBackReference
	@ManyToOne
	@JoinColumn(name = "visit_id")
	private Schedule visit;

    
    public Medicines(MedicinesDTO medicine){
        if(medicine.getId()!=null){
            this.id=medicine.getId();
        }
        this.name=medicine.getName();
        this.dosage=medicine.getDosage();
        this.frequency=medicine.getFrequency();
        this.duration=medicine.getDuration();
        this.timings=medicine.getTimings();
        this.instructions=medicine.getInstruction();
    }

}
