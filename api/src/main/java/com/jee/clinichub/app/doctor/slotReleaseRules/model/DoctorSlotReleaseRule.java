
package com.jee.clinichub.app.doctor.slotReleaseRules.model;

import java.io.Serializable;
import java.time.LocalTime;

import com.jee.clinichub.app.doctor.model.DoctorBranch;
import com.jee.clinichub.app.doctor.timeRange.model.DoctorTimeRange;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "doctor_slot_release_rules")
public class DoctorSlotReleaseRule extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "doctor_branch_id", nullable = false)
    private DoctorBranch doctorBranch;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReleaseRuleScope scope;

    @Column(name = "weekday")
    private Integer weekday; // 0 = Sunday, 6 = Saturday

    @ManyToOne
    @JoinColumn(name = "time_range_id")
    private DoctorTimeRange timeRange;

    @Column(name = "release_days_before")
    private Integer releaseDaysBefore = 1;

    @Column(name = "release_time")
    private LocalTime releaseTime = LocalTime.of(6, 0);

    @Column(name = "release_minutes_before_slot")
    private Integer releaseMinutesBeforeSlot;

    @Column(name = "is_active")
    private Boolean isActive = true;

    public DoctorSlotReleaseRule(DoctorSlotReleaseRuleDTO dto) {
        if (dto.getId() != null) {
            this.id = dto.getId();
        }
        this.scope = dto.getScope();
        this.weekday = dto.getWeekday();
        this.releaseDaysBefore = dto.getReleaseDaysBefore();
        this.releaseTime = dto.getReleaseTime();
        this.releaseMinutesBeforeSlot = dto.getReleaseMinutesBeforeSlot();
        this.isActive = dto.getIsActive();
    }
}
