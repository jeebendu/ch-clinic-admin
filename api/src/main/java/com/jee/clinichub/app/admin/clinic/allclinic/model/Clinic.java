package com.jee.clinichub.app.admin.clinic.allclinic.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.jee.clinichub.app.admin.clinic.clinicFacility.model.ClinicFacility;
import com.jee.clinichub.app.admin.clinic.clinicType.model.ClinicType;
import com.jee.clinichub.app.admin.clinic.clinicType.model.ClinicTypeDto;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.doctor.specialization.model.Specialization;
import com.jee.clinichub.config.audit.Auditable;
import com.jee.clinichub.global.tenant.model.Tenant;
import com.jee.clinichub.global.utility.SlugUtil;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "clinic")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false, exclude = { "branchList" })
public class Clinic extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String contact;
    private String address;

    @JsonManagedReference
    @OneToMany(mappedBy = "clinic", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Branch> branchList = new ArrayList<>();

    @OneToOne
    @JoinColumn(name = "clinic_type_id", nullable = true)
    private ClinicType clinicType;

    private String gst;
    private String pan;
    // *************************************
    private String description;
    private String tagline;
    @Column(name = "established_year")
    private String establishedYear;
    private String website;
    @Column(name = "emergency_contact")
    private String emergencyContact;
    @Column(name = "alternate_phone")
    private String alternatePhone;
    @Column(name = "license_number")
    private String licenseNumber;
    @Column(name = "license_authority")
    private String licenseAuthority;

    @Column(name = "slug", unique = true)
    private String slug;

    @Column(name = "owner_name")
    private String ownerName;

    private String logo;
    private String banner;
    private String favicon;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "clinic_facility_map", joinColumns = @JoinColumn(name = "clinic_id"), inverseJoinColumns = @JoinColumn(name = "facility_id"))
    private Set<ClinicFacility> clinicFacilityList;

    @Column(name = "exist_software")
    private String existSoftware;

    @Column(name = "accept_terms")
    private boolean acceptTerms;

    @Column(name = "consent_to_contact")
    private boolean consentToContact;

    @PrePersist
    public void generateSlugAndGlobalUuid() {
        if (this.slug == null || this.slug.trim().isEmpty()) {
            String fullName = (this.name != null ? this.name : "");
            this.slug = SlugUtil.toSlug(fullName);
        }
    }

    public Clinic(ClinicDto dto) {
        this.id = dto.getId();
        this.name = dto.getName();
        this.email = dto.getEmail();
        this.contact = dto.getContact();
        this.address = dto.getAddress();
        this.gst = dto.getGst();
        this.pan = dto.getPan();
        this.ownerName = dto.getOwnerName();
        this.slug = dto.getSlug();

        this.logo = dto.getLogo();
        this.banner = dto.getBanner();
        this.favicon = dto.getFavicon();

        this.description = dto.getDescription();
        this.tagline = dto.getTagline();
        this.establishedYear = dto.getEstablishedYear();
        this.website = dto.getWebsite();
        this.emergencyContact = dto.getEmergencyContact();
        this.alternatePhone = dto.getAlternatePhone();
        this.licenseNumber = dto.getLicenseNumber();
        this.licenseAuthority = dto.getLicenseAuthority();

        if (dto.getClinicType() != null) {
            this.clinicType = new ClinicType(dto.getClinicType());
        }
        this.existSoftware = dto.getExistSoftware();
        this.consentToContact = dto.isConsentToContact();
        this.acceptTerms = dto.isAcceptTerms();

        if (dto.getClinicFacilityList() != null) {
            this.clinicFacilityList = dto.getClinicFacilityList().stream().map(ClinicFacility::new)
                    .collect(Collectors.toSet());
        }
    }

    public Clinic(ClinicMaster dto) {
        this.id = dto.getId();
        this.name = dto.getName();
        this.email = dto.getEmail();
        this.contact = dto.getContact();
        this.address = dto.getAddress();
        this.gst = dto.getGst();
        this.pan = dto.getPan();
        this.ownerName = dto.getOwnerName();
        this.slug = dto.getSlug();
        if (dto.getClinicType() != null) {
            this.clinicType = dto.getClinicType();
        }

        this.logo = dto.getLogo();
        this.banner = dto.getBanner();
        this.favicon = dto.getFavicon();

        this.description = dto.getDescription();
        this.tagline = dto.getTagline();
        this.establishedYear = dto.getEstablishedYear();
        this.website = dto.getWebsite();
        this.emergencyContact = dto.getEmergencyContact();
        this.alternatePhone = dto.getAlternatePhone();
        this.licenseNumber = dto.getLicenseNumber();
        this.licenseAuthority = dto.getLicenseAuthority();

        this.existSoftware = dto.getExistSoftware();
        this.consentToContact = dto.isConsentToContact();
        this.acceptTerms = dto.isAcceptTerms();

        if (dto.getClinicFacilityList() != null) {
            this.clinicFacilityList = dto.getClinicFacilityList();
        }
    }

}
