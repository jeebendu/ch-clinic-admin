package com.jee.clinichub.app.doctor.model;

import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.jee.clinichub.app.doctor.language.model.Language;
import com.jee.clinichub.app.doctor.specialization.model.SpecializationProj;
import com.jee.clinichub.app.user.model.UserProj;

public interface DoctorWithOutBranchProj {
    Long getId();
	UserProj getUser();
	String getUid();

	// @Value("#{target.user.name}")
	// String getName();

	String getEmail();
	String getPhone();
	int getGender();
	String getBiography();
	boolean isVerified();
	String getFirstname();
	String getLastname();
	boolean isExternal();
    boolean isPublishedOnline();
	Set<Language> getLanguageList();
	String getDesgination();
	Float getExpYear();
	String getQualification();
	// List<DoctorBranchProj> getBranchList();
	Set<SpecializationProj> getSpecializationList();
	// AdditionalInfoDoctor getAdditionalInfoDoctor();
	String getJoiningDate();
	Date getCreatedTime();
	String getAbout();
	String getImage();
	String getPincode();
	String getCity();
    String getSlug();
    DoctorStatus getStatus();


	    default String getSpecialization() {
			List<String> items = getSpecializationList().stream()
			.map(SpecializationProj::getName)
			.collect(Collectors.toList());


            return items.stream()
                .map(String::new)
                .collect(Collectors.joining(", "));
    }
	
	    
	//     default String getlanguage() {
	// 		List<String> items = getLanguageList().stream()
	// 		.map(Language::getName)
	// 		.collect(Collectors.toList());


	// 		return items.stream()
	// 			.map(String::new)
	// 			.collect(Collectors.joining(", "));
	// }
	 
}
