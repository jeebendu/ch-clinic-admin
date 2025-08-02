package com.jee.clinichub.app.doctor.slots.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SlotFilter {
    
    private Long doctorId;
    private Long branchId;
    private SlotStatus status;
    private String date;
}
