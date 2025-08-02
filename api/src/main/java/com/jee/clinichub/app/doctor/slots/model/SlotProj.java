package com.jee.clinichub.app.doctor.slots.model;

import java.time.LocalTime;
import java.util.Date;

import com.jee.clinichub.app.doctor.model.DoctorBranchProj;

public interface SlotProj {

    Long getId();
    DoctorBranchProj getDoctorBranch();
    LocalTime getStartTime();
    LocalTime getEndTime();
    int getAvailableSlots();
    int getTotalSlots();
    String getStatus();
    Date getDate();
    String getSlotType();
    Integer getDuration();
    
}