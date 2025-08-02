package com.jee.clinichub.app.doctor.scheduleBreak.model;

import java.io.Serializable;
import java.time.LocalTime;

import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.doctor.model.Doctor;
import com.jee.clinichub.app.doctor.model.DoctorBranch;
import com.jee.clinichub.app.doctor.weeklySchedule.model.DayOfWeek;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "doctor_schedule_break")
public class ScheduleBreak extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "doctor_branch_id")
    private DoctorBranch doctorBranch;

    @Column(name = "break_start")
    private LocalTime breakStart;

    @Column(name = "break_end")
    private LocalTime breakEnd;

    @Column(name = " day_of_week")
    @Enumerated(EnumType.STRING)
    private DayOfWeek dayOfWeek;

    @Column(name = "description")
    private String description;

    public ScheduleBreak(ScheduleBreakDTO wSchedule) {
        if (wSchedule.getId() != null) {
            this.id = wSchedule.getId();
        }
        if (wSchedule.getDoctorBranch() != null) {
            this.doctorBranch = new DoctorBranch(wSchedule.getDoctorBranch());
        }
        this.description = wSchedule.getDescription();
        this.dayOfWeek = wSchedule.getDayOfWeek();
        this.breakStart = wSchedule.getBreakStart();
        this.breakEnd = wSchedule.getBreakEnd();
    }

}
