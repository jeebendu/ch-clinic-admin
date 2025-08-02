package com.jee.clinichub.app.doctor.medical_university.model;

import com.jee.clinichub.app.doctor.medical_Council.model.MedicalCouncil;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Data
public class MedicalUniversityDto {


    private Long id;
    private String name;

    
    public MedicalUniversityDto(MedicalUniversity medicalUniversity){
        this.id=medicalUniversity.getId();
        this.name=medicalUniversity.getName();
    }
}
