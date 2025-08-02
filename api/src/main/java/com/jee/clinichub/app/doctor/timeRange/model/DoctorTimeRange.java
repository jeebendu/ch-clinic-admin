
package com.jee.clinichub.app.doctor.timeRange.model;

import java.io.Serializable;
import java.time.LocalTime;

import com.jee.clinichub.app.doctor.weeklySchedule.model.WeeklySchedule;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "doctor_time_ranges")
public class DoctorTimeRange extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "availability_id", nullable = false)
    private WeeklySchedule availability;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "slot_duration", nullable = false)
    private int slotDuration = 15;

    @Column(name = "slot_quantity", nullable = false)
    private int slotQuantity = 1;

    public DoctorTimeRange(DoctorTimeRangeDTO dto) {
        if (dto.getId() != null) {
            this.id = dto.getId();
        }
        this.startTime = dto.getStartTime();
        this.endTime = dto.getEndTime();
        this.slotDuration = dto.getSlotDuration();
        this.slotQuantity = dto.getSlotQuantity();
    }
}
