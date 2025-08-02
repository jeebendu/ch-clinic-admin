package com.jee.clinichub.app.doctor.percentage.model;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.jee.clinichub.app.doctor.model.Doctor;
import com.jee.clinichub.app.enquiryService.model.EnquiryServiceType;
import com.jee.clinichub.config.audit.Auditable;


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
import lombok.ToString;


@Table(name = "doctor_percentage")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Data
// @EqualsAndHashCode(callSuper=false)
public class Percentage extends Auditable<String>  implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Float percentage;
	
	
    @JsonBackReference
    @OneToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @OneToOne
    @JoinColumn(name = "service_type_id", nullable = false)
    private EnquiryServiceType enquiryServiceType;

    public Percentage(PercentageDTO percentageDTO){
        this.id=percentageDTO.getId();
        this.percentage = percentageDTO.getPercentage();
        this.enquiryServiceType=new EnquiryServiceType(percentageDTO.getEnquiryServiceType());
        this.doctor=new Doctor(percentageDTO.getDoctor());
    }
}