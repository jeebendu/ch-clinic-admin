package com.jee.clinichub.app.doctor.slots.model;

import java.io.Serializable;
import java.time.LocalTime;
import java.util.Date;
import java.util.UUID;

import com.jee.clinichub.app.doctor.model.DoctorBranch;
import com.jee.clinichub.config.audit.Auditable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "doctor_slot")
public class Slot extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "doctor_branch_id")
    private DoctorBranch doctorBranch;

    @Column(name = "start_time")
    private LocalTime startTime;
    @Column(name = "end_time")
    private LocalTime endTime;
    @Column(name = "available_slots")
    private int availableSlots;

    @Column(name = "total_slots")
    private int totalSlots;
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private SlotStatus status;
    @Column(name = "date")
    private Date date;

    private Integer duration;

    @Column(name = "slot_type")
    @Enumerated(EnumType.STRING)
    private SlotType slotType;

    @Column(name = "global_slot_id", unique = true)
    private UUID globalSlotId;

    @PrePersist
    public void generateSlugAndGlobalUuid() {
        if (this.globalSlotId == null) {
            this.globalSlotId = UUID.randomUUID();
        }
    }

    public Slot(SlotDto slot) {
        this.id = slot.getId();
        this.doctorBranch = new DoctorBranch(slot.getDoctorBranch());
        this.startTime = slot.getStartTime();
        this.endTime = slot.getEndTime();
        this.availableSlots = slot.getAvailableSlots();
        this.totalSlots = slot.getTotalSlots();
        this.status = slot.getStatus();
        this.date = slot.getDate();
        this.slotType = slot.getSlotType();
        this.duration = slot.getDuration();
        this.globalSlotId = slot.getGlobalSlotId();
    }

}
