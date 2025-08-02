package com.jee.clinichub.app.doctor.blockedSlot.model;

import java.io.Serializable;
import java.time.LocalTime;
import java.util.Date;

import com.jee.clinichub.app.doctor.model.Doctor;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
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
@Table(name = "blocked_slot")
public class BlockedSlot extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @Column(name = "slot_date")
    private Date slotDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "reason")
    private String reason;

    public BlockedSlot(BlockedSlotDTO bSlot) {
        if (bSlot.getId() != null) {
            this.id = bSlot.getId();
        }
        this.doctor = new Doctor(bSlot.getDoctor());
        this.reason = bSlot.getReason();
        this.slotDate = bSlot.getSlotDate();
        this.startTime = bSlot.getStartTime();
        this.endTime = bSlot.getEndTime();
    }

}
