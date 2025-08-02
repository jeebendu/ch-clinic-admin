
package com.jee.clinichub.app.doctor.weeklySchedule.model;

import java.io.Serializable;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import com.jee.clinichub.app.doctor.model.DoctorBranch;
import com.jee.clinichub.app.doctor.slots.model.SlotType;
import com.jee.clinichub.app.doctor.timeRange.model.DoctorTimeRange;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString(exclude = "timeRanges")
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "doctor_availability")
public class WeeklySchedule extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "doctor_branch_id")
    private DoctorBranch doctorBranch;

    @Column(name = "day_of_week")
    @Enumerated(EnumType.STRING)
    private DayOfWeek dayOfWeek;

    @Column(name = "active")
    private boolean active;

    @Column(name = "release_type")
    @Enumerated(EnumType.STRING)
    private SlotType releaseType;

    @Column(name = "release_before")
    private int releaseBefore;

    @Column(name = "release_time")
    private LocalTime releaseTime;

    @OneToMany(mappedBy = "availability", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<DoctorTimeRange> timeRanges = new ArrayList<>();

    public WeeklySchedule(WeeklyScheduleDTO wSchedule) {
        if (wSchedule.getId() != null) {
            this.id = wSchedule.getId();
        }
        if(wSchedule.getDoctorBranch() != null) {
            this.doctorBranch = new DoctorBranch(wSchedule.getDoctorBranch());
        }

        this.active = wSchedule.isActive();
        this.dayOfWeek = wSchedule.getDayOfWeek();
        this.releaseType = wSchedule.getReleaseType();
        this.releaseBefore = wSchedule.getReleaseBefore();
        this.releaseTime = wSchedule.getReleaseTime();

        // Handle time ranges
        if (wSchedule.getTimeRanges() != null && !wSchedule.getTimeRanges().isEmpty()) {
            this.timeRanges.clear();
            wSchedule.getTimeRanges().forEach(timeRangeDTO -> {
                DoctorTimeRange timeRange = new DoctorTimeRange(timeRangeDTO);
                timeRange.setAvailability(this);
                this.timeRanges.add(timeRange);
            });
        }
    }
}
