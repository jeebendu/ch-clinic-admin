package com.jee.clinichub.app.patient.model;

import com.jee.clinichub.app.user.model.UserProj;



public interface PatientOptProj  {
	
    Long getId();
    String getUid();
    String getFirstname();
    String getLastname();
    
    //@Value("#{target.firstName + ' ' + target.lastName}")
    //String getName();
    //String getPhone();
	UserProj getUser();
	
}