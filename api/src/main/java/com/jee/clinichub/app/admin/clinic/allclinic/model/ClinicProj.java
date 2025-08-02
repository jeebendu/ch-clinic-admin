package com.jee.clinichub.app.admin.clinic.allclinic.model;

import java.util.Date;
import java.util.Set;

import com.jee.clinichub.app.admin.clinic.clinicFacility.model.ClinicFacility;
import com.jee.clinichub.app.admin.clinic.clinicType.model.ClinicTypeProj;


public interface ClinicProj {

    Long getId();
    String getName();
    String getEmail();
    String getContact();
    String getAddress();
    Date getCreatedTime();
    ClinicTypeProj getClinicType();
    String getGst();
    String getPan();
    String getLogo();
    String getBanner();
    String getFavicon();
    String getOwnerName();
    String getSlug();
    Set<ClinicFacility> getClinicFacilityList();
    boolean isConsentToContact();
    boolean isAcceptTerms();
    String getExistSoftware();
}