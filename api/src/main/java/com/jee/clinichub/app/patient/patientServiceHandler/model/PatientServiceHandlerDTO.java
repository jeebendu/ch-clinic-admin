package com.jee.clinichub.app.patient.patientServiceHandler.model;

import com.jee.clinichub.app.enquiryService.model.EnquiryServiceTypeDto;
import com.jee.clinichub.app.patient.model.PatientDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class PatientServiceHandlerDTO {

    private Long id;
    private EnquiryServiceTypeDto enquiryservicetype;
    private PatientDto patient;


     public PatientServiceHandlerDTO(PatientServiceHandler serviceHandler) {
        this.id = serviceHandler.getId();
        this.enquiryservicetype = new EnquiryServiceTypeDto(serviceHandler.getEnquiryservicetype());
        this.patient = new PatientDto(serviceHandler.getPatient());
    }
}
