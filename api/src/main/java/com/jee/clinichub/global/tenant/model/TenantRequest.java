package com.jee.clinichub.global.tenant.model;

import java.util.Date;

import org.springframework.data.annotation.CreatedDate;

import com.jee.clinichub.app.admin.clinic.clinicType.model.ClinicType;
import com.jee.clinichub.app.core.district.model.District;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "tenant_request")
public class TenantRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String contact;

    private String email;

    private String pincode;

    private String landmark;

    @Size(max = 10)
    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "client_id", nullable = false, unique = true)
    private String clientId;

    @Column(name = "client_url", nullable = false)
    private String clientUrl;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "favicon", nullable = false)
    private String favIcon;

    @Column(name = "banner_home", nullable = false)
    private String bannerHome;

    @Column(name = "logo", nullable = false)
    private String logo;

    @Column(name = "contact_name")
    private String contactName;

    @Column(name = "contact_designation")
    private String contactDesignation;

    private String address;

    private String city;

    @OneToOne
    @JoinColumn(name = "district_id")
    private District district;

    @OneToOne
    @JoinColumn(name = "clinic_type_id", nullable = true)
    private ClinicType clinicType;

    @Column(name = "exist_software")
    private String existSoftware;
    
    @Column(name = "accept_terms")
    private boolean acceptTerms;
    
    @Column(name = "consent_to_contact")
    private boolean consentToContact;

    @CreatedDate
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_time", nullable = false)
    private Date createdTime;

    public TenantRequest(TenantRequestDto tenantRequestDto) {
        this.id = tenantRequestDto.getId();
        this.clientId = tenantRequestDto.getClientId().toLowerCase();
        this.name = tenantRequestDto.getName();
        this.contact = tenantRequestDto.getContact();
        this.status = tenantRequestDto.getStatus();
        this.email = tenantRequestDto.getEmail();
        this.clientUrl = tenantRequestDto.getClientUrl();
        this.title = tenantRequestDto.getTitle();
        this.contactName = tenantRequestDto.getContactName();
        this.contactDesignation = tenantRequestDto.getContactDesignation();
        this.address = tenantRequestDto.getAddress();
        this.city = tenantRequestDto.getCity();
        this.district = tenantRequestDto.getDistrict();
        this.pincode = tenantRequestDto.getPincode();
        this.landmark = tenantRequestDto.getLandmark();
        if(tenantRequestDto.getClinicType()!=null){
            this.clinicType=tenantRequestDto.getClinicType();
        }
    this.existSoftware=tenantRequestDto.getExistSoftware();
    this.consentToContact=tenantRequestDto.isConsentToContact();
    this.acceptTerms=tenantRequestDto.isAcceptTerms();

    }

}
