package com.jee.clinichub.app.appointment.visitLabOrder.model;

import java.util.ArrayList;
import java.util.List;

import com.jee.clinichub.app.appointment.labtest.model.LabTest;
import com.jee.clinichub.app.appointment.labtest.model.LabTestDTO;
import com.jee.clinichub.app.appointment.visitLabResult.model.LabResult;
import com.jee.clinichub.app.appointment.visitLabResult.model.LabResultDTO;
import com.jee.clinichub.app.appointment.visitMedicines.model.MedicinesDTO;
import com.jee.clinichub.app.patient.schedule.model.ScheduleDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LabOrderDTO {

    private Long id;
    private ScheduleDto visit;
    private LabTestDTO labtest;
    private PriorityTest priority;
    private String notes;
    private LabOrderStatus status;
    List<LabResultDTO> labresults = new ArrayList<LabResultDTO>();

    public LabOrderDTO(LabOrder labOrder) {
        if (labOrder.getId() != null) {
            this.id = labOrder.getId();
        }
        this.labtest = new LabTestDTO(labOrder.getLabtest());
        this.priority = labOrder.getPriority();
        this.notes = labOrder.getNotes();
        this.status = labOrder.getStatus();

        // For laborder res
        labOrder.getLabresults().forEach(item -> {
            this.labresults.add(new LabResultDTO(item));
        });
    }

}
