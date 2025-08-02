package com.jee.clinichub.app.admin.clinic.allclinic.model;

public interface ClinicPublicViewProj {
    
    Integer getId();
    String getClinicName();
    String getClinicTypeName();
    Integer getBranchCount();
    String getBranches();
    Double getClinicRating();
    Integer getReviewCount();
    String getLogo();
    String getBanner();
    String getFavicon();
    String getSlug();
}
