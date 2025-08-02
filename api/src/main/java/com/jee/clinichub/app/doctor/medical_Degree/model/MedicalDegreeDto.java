package com.jee.clinichub.app.doctor.medical_Degree.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Data
public class MedicalDegreeDto {


    private Long id;
    private String name;

    
    public MedicalDegreeDto(MedicalDegree medicalCouncil){
        this.id=medicalCouncil.getId();
        this.name=medicalCouncil.getName();
    }
}
