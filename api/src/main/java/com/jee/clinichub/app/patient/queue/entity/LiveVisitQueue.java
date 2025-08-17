
package com.jee.clinichub.app.patient.queue.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "live_visit_queue")
@org.hibernate.annotations.Immutable
public class LiveVisitQueue {

    @Id
    @Column(name = "patient_schedule_id")
    private Long patientScheduleId;

    @Column(name = "consulting_doctor_id")
    private Long consultingDoctorId;

    @Column(name = "branch_id")
    private Long branchId;

    @Column(name = "patient_id")
    private Long patientId;

    @Column(name = "checkin_time")
    private LocalDateTime checkinTime;

    @Column(name = "planned_sequence")
    private Integer plannedSequence;

    @Column(name = "actual_sequence")
    private Integer actualSequence;

    @Column(name = "estimated_consultation_time")
    private LocalDateTime estimatedConsultationTime;

}
