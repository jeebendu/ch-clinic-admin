package com.jee.clinichub.app.doctor.blockedSlot.model;

import java.time.LocalTime;
import java.util.Date;

import com.jee.clinichub.app.doctor.model.DoctorDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BlockedSlotDTO {

    private Long id;
    private DoctorDto doctor;
    private Date slotDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String reason;

    private boolean approved;

    public BlockedSlotDTO(BlockedSlot bSlot) {
        if (bSlot.getId() != null) {
            this.id = bSlot.getId();
        }
        this.doctor = new DoctorDto(bSlot.getDoctor());
        this.reason = bSlot.getReason();
        this.slotDate = bSlot.getSlotDate();
        this.startTime = bSlot.getStartTime();
        this.endTime = bSlot.getEndTime();
    }
}
