
package com.jee.clinichub.app.doctor.timeRange.model;

import java.time.LocalTime;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorTimeRangeDTO {

    private Long id;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @Min(value = 5, message = "Slot duration must be at least 5 minutes")
    private int slotDuration = 15;

    @Min(value = 1, message = "Slot quantity must be at least 1")
    private int slotQuantity = 1;

    public DoctorTimeRangeDTO(DoctorTimeRange entity) {
        this.id = entity.getId();
        this.startTime = entity.getStartTime();
        this.endTime = entity.getEndTime();
        this.slotDuration = entity.getSlotDuration();
        this.slotQuantity = entity.getSlotQuantity();
    }
}
