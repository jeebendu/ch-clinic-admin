package com.jee.clinichub.app.doctor.slots.model;


import java.time.LocalTime;
import java.util.Date;

import com.jee.clinichub.app.doctor.model.DoctorBranchDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SlotHandler {

    private DoctorBranchDto doctorBranchDto;
    private int slotDuration; 
    private int maxCapacity; 
    private LocalTime startTime;
    private LocalTime endTime;
    private Date date;
    private SlotType slotType;
}

