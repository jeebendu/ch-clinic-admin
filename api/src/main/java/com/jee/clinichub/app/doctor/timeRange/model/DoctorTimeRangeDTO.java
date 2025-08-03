
package com.jee.clinichub.app.doctor.timeRange.model;

import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorTimeRangeDTO {
    
    private Long id;
    private LocalTime startTime;
    private LocalTime endTime;
    private int slotDuration = 15;
    private int slotQuantity = 1;

    public DoctorTimeRangeDTO(DoctorTimeRange entity) {
        this.id = entity.getId();
        this.startTime = entity.getStartTime();
        this.endTime = entity.getEndTime();
        this.slotDuration = entity.getSlotDuration();
        this.slotQuantity = entity.getSlotQuantity();
    }
}
