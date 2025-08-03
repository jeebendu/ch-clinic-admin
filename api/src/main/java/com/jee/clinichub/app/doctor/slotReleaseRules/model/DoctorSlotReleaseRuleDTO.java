
package com.jee.clinichub.app.doctor.slotReleaseRules.model;

import java.time.LocalTime;

import com.jee.clinichub.app.doctor.model.DoctorBranchDto;
import com.jee.clinichub.app.doctor.timeRange.model.DoctorTimeRangeDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorSlotReleaseRuleDTO {
    
    private Long id;
    private DoctorBranchDto doctorBranch;
    private ReleaseRuleScope scope;
    private Integer weekday;
    private DoctorTimeRangeDTO timeRange;
    private Integer releaseDaysBefore = 1;
    private LocalTime releaseTime = LocalTime.of(6, 0);
    private Integer releaseMinutesBeforeSlot;
    private Boolean isActive = true;

    public DoctorSlotReleaseRuleDTO(DoctorSlotReleaseRule entity) {
        this.id = entity.getId();
        if (entity.getDoctorBranch() != null) {
            this.doctorBranch = new DoctorBranchDto(entity.getDoctorBranch());
        }
        this.scope = entity.getScope();
        this.weekday = entity.getWeekday();
        if (entity.getTimeRange() != null) {
            this.timeRange = new DoctorTimeRangeDTO(entity.getTimeRange());
        }
        this.releaseDaysBefore = entity.getReleaseDaysBefore();
        this.releaseTime = entity.getReleaseTime();
        this.releaseMinutesBeforeSlot = entity.getReleaseMinutesBeforeSlot();
        this.isActive = entity.getIsActive();
    }
}
