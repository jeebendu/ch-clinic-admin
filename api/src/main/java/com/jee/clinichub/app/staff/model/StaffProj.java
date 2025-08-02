package com.jee.clinichub.app.staff.model;

import java.util.Date;

import com.jee.clinichub.app.user.model.UserProj;



public interface StaffProj  {
	
    Long getId();
	String getDob();
	String getFirstname();
	String getLastname();
	String getAge();
	String getGender();
	String getWhatsappNo();
	String getAddress();
	String getUid();
	String getProfile();
	UserProj getUser();
	Date getCreatedTime();
	
}