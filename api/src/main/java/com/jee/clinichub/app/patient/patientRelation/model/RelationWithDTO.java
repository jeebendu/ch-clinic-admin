package com.jee.clinichub.app.patient.patientRelation.model;


import java.util.UUID;

import com.jee.clinichub.app.patient.model.PatientDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RelationWithDTO {
    
    private Long id;
    private PatientDto patient;
    private String name;
    private String gender;
    private Integer age;
    private String phone;
    private String relationship;
    private UUID globalId;

    public RelationWithDTO(RelationWith relation){
        this.id=relation.getId();
        this.patient=new PatientDto(relation.getPatient());
        this.name=relation.getName();
        this.age=relation.getAge();
        this.gender=relation.getGender();
        this.relationship=relation.getRelationship();
        this.phone=relation.getPhone();
        this.globalId=relation.getGlobalId();
    }
}
