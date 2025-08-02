package com.jee.clinichub.app.doctor.scheduleBreak.model;

import java.time.LocalTime;

import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.doctor.model.DoctorBranch;
import com.jee.clinichub.app.doctor.model.DoctorBranchDto;
import com.jee.clinichub.app.doctor.model.DoctorDto;
import com.jee.clinichub.app.doctor.weeklySchedule.model.DayOfWeek;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScheduleBreakDTO {

    private Long id;
    private DoctorBranchDto doctorBranch;
    private DayOfWeek dayOfWeek;
    private LocalTime breakStart;
    private LocalTime breakEnd;
    private String description;

    public ScheduleBreakDTO(ScheduleBreak wSchedule) {
        if (wSchedule.getId() != null) {
            this.id = wSchedule.getId();
        }
        if (wSchedule.getDoctorBranch() != null) {
            this.doctorBranch = new DoctorBranchDto(wSchedule.getDoctorBranch());
        } 
        this.description = wSchedule.getDescription();
        this.dayOfWeek = wSchedule.getDayOfWeek();
        this.breakStart = wSchedule.getBreakStart();
        this.breakEnd = wSchedule.getBreakEnd();
    }
}
