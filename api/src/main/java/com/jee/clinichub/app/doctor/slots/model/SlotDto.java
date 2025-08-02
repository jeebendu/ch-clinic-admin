package com.jee.clinichub.app.doctor.slots.model;

import java.time.LocalTime;
import java.util.Date;
import java.util.UUID;

import com.jee.clinichub.app.doctor.model.DoctorBranchDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SlotDto {

    private Long id;
    private DoctorBranchDto doctorBranch;
    private LocalTime startTime;
    private LocalTime endTime;
    private int availableSlots;
    private int totalSlots;
    private SlotStatus status;
    private Date date;
    private SlotType slotType;
    private Integer duration;
    private UUID globalSlotId;

    public SlotDto(Slot slot){
        
        this.id = slot.getId();
        if(slot.getDoctorBranch()!=null && slot.getDoctorBranch().getId()!=null){
            this.doctorBranch = new DoctorBranchDto(slot.getDoctorBranch());
        }
        this.startTime = slot.getStartTime();
        this.endTime = slot.getEndTime();
        this.availableSlots = slot.getAvailableSlots();
        this.status = slot.getStatus();
        this.date = slot.getDate();
        this.totalSlots=slot.getTotalSlots();
        this.slotType = slot.getSlotType();
        this.duration = slot.getDuration();
         this.globalSlotId=slot.getGlobalSlotId();
    }

}