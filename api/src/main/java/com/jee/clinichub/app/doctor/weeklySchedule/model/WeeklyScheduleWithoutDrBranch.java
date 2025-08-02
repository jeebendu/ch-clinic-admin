
package com.jee.clinichub.app.doctor.weeklySchedule.model;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import com.jee.clinichub.app.doctor.model.DoctorBranchDto;
import com.jee.clinichub.app.doctor.slots.model.SlotType;
import com.jee.clinichub.app.doctor.timeRange.model.DoctorTimeRangeDTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WeeklyScheduleWithoutDrBranch {

    private Long id;


    @NotNull(message = "Day of week is required")
    private DayOfWeek dayOfWeek;
    
    private boolean active;
    
    private SlotType releaseType = SlotType.COUNTWISE;
    
    private int releaseBefore = 0;
    
    private LocalTime releaseTime;

    @Valid
    private List<DoctorTimeRangeDTO> timeRanges = new ArrayList<>();

    public WeeklyScheduleWithoutDrBranch(WeeklySchedule wSchedule) {
        if (wSchedule.getId() != null) {
            this.id = wSchedule.getId();
        }
        this.active = wSchedule.isActive();
        this.dayOfWeek = wSchedule.getDayOfWeek();
        this.releaseType = wSchedule.getReleaseType();
        this.releaseBefore = wSchedule.getReleaseBefore();
        this.releaseTime = wSchedule.getReleaseTime();

        // Convert time ranges
        if (wSchedule.getTimeRanges() != null && !wSchedule.getTimeRanges().isEmpty()) {
            this.timeRanges = wSchedule.getTimeRanges().stream()
                    .map(DoctorTimeRangeDTO::new)
                    .toList();
        }
    }
}
