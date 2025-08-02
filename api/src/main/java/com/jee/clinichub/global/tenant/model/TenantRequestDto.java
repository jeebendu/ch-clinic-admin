package com.jee.clinichub.global.tenant.model;

import java.time.LocalDateTime;

import com.jee.clinichub.app.admin.clinic.clinicType.model.ClinicType;
import com.jee.clinichub.app.core.district.model.District;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TenantRequestDto {

  private Long id;

  private String name;

  private String contact;

  private String pincode;

  private String landmark;

  private String email;

  private String status;

  private String clientId;

  private ClinicType clinicType;

  private String clientUrl;

  private String title;

  private String favIcon;

  private String bannerHome;

  private String logo;

  private String contactName;

  private String contactDesignation;

  private String address;

  private String city;

  private District district;

  private String existSoftware;

  private boolean acceptTerms;

  private boolean consentToContact;

  public TenantRequestDto(TenantRequest tenantRequest) {
    this.id = tenantRequest.getId();
    this.clientId = tenantRequest.getClientId();
    this.clientUrl = tenantRequest.getClientUrl();
    this.status = tenantRequest.getStatus();
    this.name = tenantRequest.getName();
    this.contact = tenantRequest.getContact();
    this.email = tenantRequest.getEmail();
    this.title = tenantRequest.getTitle();
    this.contactName = tenantRequest.getContactName();
    this.contactDesignation = tenantRequest.getContactDesignation();
    this.address = tenantRequest.getAddress();
    this.city = tenantRequest.getCity();
    this.district = tenantRequest.getDistrict();
    this.pincode = tenantRequest.getPincode();
    this.landmark = tenantRequest.getLandmark();
    if (tenantRequest.getClinicType() != null) {
      this.clinicType = tenantRequest.getClinicType();
    }

    this.existSoftware=tenantRequest.getExistSoftware();
    this.consentToContact=tenantRequest.isConsentToContact();
    this.acceptTerms=tenantRequest.isAcceptTerms();

  }

}
