package com.jee.clinichub.app.doctor.model;

public interface DoctorClinicMapProjection {
	Long getId();
    String getDoctorName();
    Integer getGender();
    String getSlug();
    Float getExperienceYears();
    String getCity();
    String getSpecialties();
    String getLanguages();
    String getClinicNames();
    String getClinicBranches();
    Double getAverageRating();
    Integer getReviewCount();
    Integer getMinPrice();
    Integer getMaxPrice();
    String getProfileImage();
    Integer getBranchCount();
    Integer getClinicCount();
	
}
