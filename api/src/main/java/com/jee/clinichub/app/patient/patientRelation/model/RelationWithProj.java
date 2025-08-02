package com.jee.clinichub.app.patient.patientRelation.model;

import com.jee.clinichub.app.patient.model.PatientProj;

public interface RelationWithProj {

    Long getId();

    PatientProj getPatient();

    String getName();

    String getGender();
    
    String getPhone();
  
    Integer getAge();

    String getRelationship();

}
