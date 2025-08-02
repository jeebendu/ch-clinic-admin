package com.jee.clinichub.app.appointment.visitLabResult.model;

import com.jee.clinichub.app.appointment.visitLabOrder.model.LabOrderDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LabResultDTO {

    private Long id;
    private LabOrderDTO labOrder;
    private String result;
    private String unit;
    private String notes;
    private LabResultStatus status;

    public LabResultDTO(LabResult labResult) {
        this.id = labResult.getId();
        this.result = labResult.getResult();
        this.unit = labResult.getUnit();
        this.notes = labResult.getNotes();
        this.status = labResult.getStatus();
    }
}
