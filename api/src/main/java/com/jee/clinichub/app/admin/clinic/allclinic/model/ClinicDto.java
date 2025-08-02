
package com.jee.clinichub.app.admin.clinic.allclinic.model;

import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.jee.clinichub.app.admin.clinic.clinicFacility.model.ClinicFacilityDto;
import com.jee.clinichub.app.admin.clinic.clinicType.model.ClinicTypeDto;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.model.BranchDto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClinicDto {
    private Long id;
    private String name;
    private String email;
    private String contact;
    private String address;
    private Date createdTime;
    private Date updatedTime;
    private ClinicTypeDto clinicType;
    private List<BranchDto> branchList;
    private String slug;

    private String gst;
    private String pan;
    private String ownerName;
    private Set<ClinicFacilityDto> clinicFacilityList;

    private String logo;
    private String banner;
    private String favicon;

    private String description;
    private String tagline;
    private String establishedYear;
    private String website;
    private String emergencyContact;
    private String alternatePhone;
    private String licenseNumber;
    private String licenseAuthority;

    private String existSoftware;

    private boolean acceptTerms;

    private boolean consentToContact;

    public ClinicDto(Clinic clinic) {
        this.id = clinic.getId();
        this.name = clinic.getName();
        this.email = clinic.getEmail();
        this.contact = clinic.getContact();
        this.address = clinic.getAddress();
        this.slug = clinic.getSlug();

        this.gst = clinic.getGst();
        this.pan = clinic.getPan();
        this.ownerName = clinic.getOwnerName();

        this.logo = clinic.getLogo();
        this.banner = clinic.getBanner();
        this.favicon = clinic.getFavicon();

        this.description = clinic.getDescription();
        this.tagline = clinic.getTagline();
        this.establishedYear = clinic.getEstablishedYear();
        this.website = clinic.getWebsite();
        this.emergencyContact = clinic.getEmergencyContact();
        this.alternatePhone = clinic.getAlternatePhone();
        this.licenseNumber = clinic.getLicenseNumber();
        this.licenseAuthority = clinic.getLicenseAuthority();
        this.existSoftware = clinic.getExistSoftware();
        this.consentToContact = clinic.isConsentToContact();
        this.acceptTerms = clinic.isAcceptTerms();

        this.createdTime = clinic.getCreatedTime();
        if (clinic.getClinicType() != null) {
            this.clinicType = new ClinicTypeDto(clinic.getClinicType());
        }
        if (clinic.getBranchList() != null && !clinic.getBranchList().isEmpty()) {
            this.branchList = clinic.getBranchList().stream()
                    .map(BranchDto::fromBranchWithoutClinic)
                    .collect(Collectors.toList());
        }
        if (clinic.getClinicFacilityList() != null) {
            this.clinicFacilityList = clinic.getClinicFacilityList().stream()
                    .map(ClinicFacilityDto::new)
                    .collect(Collectors.toSet());
        }

    }

}
