package com.jee.clinichub.app.patient.model;


import java.util.Date;

import com.jee.clinichub.app.core.country.model.CountryProj;
import com.jee.clinichub.app.core.district.model.DistrictProj;
import com.jee.clinichub.app.core.state.model.StateProj;
import com.jee.clinichub.app.user.model.UserProj;



public interface PatientProj  {
	
    Long getId();
    String getUid();
    String getFirstname();
    String getLastname();
	String getDob();
    PatientSource getSource();

	String getAge();
	String getGender();
	String getAlternativeContact();
	String getWhatsappNo();
	String getAddress();
	DistrictProj getDistrict();
	Date getCreatedTime();
	UserProj getUser();
	String getCity();
	
}