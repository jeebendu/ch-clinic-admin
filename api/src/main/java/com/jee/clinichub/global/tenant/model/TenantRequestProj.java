package com.jee.clinichub.global.tenant.model;

import java.util.Date;

import com.jee.clinichub.app.admin.clinic.clinicType.model.ClinicType;
import com.jee.clinichub.app.core.district.model.District;


public interface TenantRequestProj {
    
    Long getId();

    String getName();

    String getContact();

    String getEmail();

    String getPincode();

    String getLandmark();

    String getStatus();

    String getClientId();

    String getClientUrl();

    String getTitle();

    String getFavIcon();

    String getBannerHome();

    String getLogo();

    String getContactName();

    String getContactDesignation();

    String getAddress();

    String getCity();
    
    District getDistrict();
    
    ClinicType getClinicType();
    String getExistSoftware();
    boolean isConsentToContact();
    boolean isAcceptTerms();
    
    Date getCreatedTime();
}
