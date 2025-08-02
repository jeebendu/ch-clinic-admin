package com.jee.clinichub.app.doctor.percentage.model;

import com.jee.clinichub.app.doctor.model.DoctorDto;
import com.jee.clinichub.app.enquiryService.model.EnquiryServiceTypeDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Data
public class PercentageDTO {

    private Long id;

    private Float percentage;

    private DoctorDto doctor;

    private EnquiryServiceTypeDto enquiryServiceType;

    public PercentageDTO(Percentage percentage) {
        this.id = percentage.getId();
        this.percentage = percentage.getPercentage();
        this.enquiryServiceType = new EnquiryServiceTypeDto(percentage.getEnquiryServiceType());
        this.doctor = new DoctorDto(percentage.getDoctor());
    }
}
