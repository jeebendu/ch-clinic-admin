package com.jee.clinichub.app.admin.clinic.allclinic.model;

import com.jee.clinichub.app.admin.clinic.clinicType.model.ClinicType;
import com.jee.clinichub.app.admin.clinic.clinicType.model.ClinicTypeDto;
import com.jee.clinichub.global.tenant.model.Tenant;
import com.jee.clinichub.global.tenant.model.TenantDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class ClinicMasterDTO extends ClinicDto {
    private TenantDto tenant;

    public ClinicMasterDTO(ClinicMaster clinicMaster) {

        if(clinicMaster.getId()!=null){
            this.setId(clinicMaster.getId());
        }
        this.setName(clinicMaster.getName());
        this.setEmail(clinicMaster.getEmail());
        this.setContact(clinicMaster.getContact());
        this.setAddress(clinicMaster.getAddress());
        this.setGst(clinicMaster.getGst());
        this.setPan(clinicMaster.getPan());
        this.setCreatedTime(clinicMaster.getCreatedTime());
        this.setOwnerName(clinicMaster.getOwnerName());
        this.setSlug(clinicMaster.getSlug());
        
        this.setLogo(clinicMaster.getLogo());
        this.setBanner(clinicMaster.getBanner());
        this.setFavicon(clinicMaster.getFavicon());

        this.setDescription(clinicMaster.getDescription());
        this.setTagline(clinicMaster.getTagline());
        this.setEstablishedYear(clinicMaster.getEstablishedYear());
        this.setWebsite(clinicMaster.getWebsite());
        this.setEmergencyContact(clinicMaster.getEmergencyContact());
        this.setAlternatePhone(clinicMaster.getAlternatePhone());
        this.setLicenseNumber(clinicMaster.getLicenseNumber());
        this.setLicenseAuthority(clinicMaster.getLicenseAuthority());
        this.setOwnerName(clinicMaster.getOwnerName());
        this.setExistSoftware(clinicMaster.getExistSoftware());
        this.setConsentToContact(clinicMaster.isConsentToContact());
        this.setAcceptTerms(clinicMaster.isAcceptTerms());

        if (clinicMaster.getClinicType() != null) {
            this.setClinicType(new ClinicTypeDto(clinicMaster.getClinicType()));
        }

        if (clinicMaster.getTenant() != null) {
            this.tenant = new TenantDto(clinicMaster.getTenant());
        }
    }

    public ClinicMasterDTO(Clinic clinic, Tenant tenant) {
        super(clinic); // maps all base fields from Clinic
        if (tenant != null) {
            this.tenant = new TenantDto(tenant);
        }
    }
}