package com.jee.clinichub.app.doctor.doctorServiceMap.model;

import com.jee.clinichub.app.doctor.model.DoctorBranchDto;
import com.jee.clinichub.app.enquiryService.model.EnquiryServiceTypeDto;

import lombok.AllArgsConstructor;

import lombok.Data;

import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorServiceMapDto {

  
    private Long id;
    private DoctorBranchDto doctorBranch;
    private EnquiryServiceTypeDto serviceType;
    private Double price;


public DoctorServiceMapDto (DoctorServiceMap doctorServiceMap) {
    this.id = doctorServiceMap.getId();
    this.doctorBranch = new DoctorBranchDto(doctorServiceMap.getDoctorBranch());
    this.serviceType = new EnquiryServiceTypeDto(doctorServiceMap.getServiceType());
    this.price = doctorServiceMap.getPrice();
}
}