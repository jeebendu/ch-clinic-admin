package com.jee.clinichub.app.appointment.prescription.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.appointment.labtest.model.LabTestDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LaboratoryTestDTO {


    private Long id;

    private LabTestDTO labTest;
    private String instructions;

    public LaboratoryTestDTO(LaboratoryTest test){
        this.id=test.getId();
        this.labTest=new LabTestDTO(test.getLabTest());
        this.instructions=test.getInstructions();
    }


}
