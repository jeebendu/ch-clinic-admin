package com.jee.clinichub.app.admin.clinic.clinicServiceMap.model;

import java.io.Serializable;

import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.enquiryService.model.EnquiryServiceType;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "clinic_service_map")
public class ClinicServiceMap extends Auditable<String> implements Serializable {
   
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Double price;

    @OneToOne
    @JoinColumn(name = "service_type_id")
    private EnquiryServiceType enquiryService;

    @OneToOne
    @JoinColumn(name = "branch_id")
    private Branch branch;

    public ClinicServiceMap(ClinicAndServiceMapDto clinicServiceDto) {
        this.id = clinicServiceDto.getId();
        this.price = clinicServiceDto.getPrice();
        this.enquiryService = new EnquiryServiceType(clinicServiceDto.getEnquiryService());
        this.branch = Branch.fromDto(clinicServiceDto.getBranch());
    }

    
}




