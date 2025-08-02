package com.jee.clinichub.app.doctor.medical_Council.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Data
public class MedicalCouncilDto {


    private Long id;
    private String name;

    
    public MedicalCouncilDto(MedicalCouncil medicalCouncil){
        this.id=medicalCouncil.getId();
        this.name=medicalCouncil.getName();
    }
}
