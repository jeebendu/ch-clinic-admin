package com.jee.clinichub.app.admin.clinic.clinicServiceMap.model;

import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.enquiryService.model.EnquiryServiceTypeDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClinicAndServiceMapDto {

    private Long id;
    private  EnquiryServiceTypeDto enquiryService;
   
    private BranchDto branch;
    private Double price;

    public ClinicAndServiceMapDto(ClinicServiceMap clinicAndServiceMapDto) {
        this.id = clinicAndServiceMapDto.getId();
        this.price = clinicAndServiceMapDto.getPrice();
       
        this.enquiryService = new EnquiryServiceTypeDto(clinicAndServiceMapDto.getEnquiryService());
        this.branch = new BranchDto(clinicAndServiceMapDto.getBranch());
    }

   
}
