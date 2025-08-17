
package com.jee.clinichub.modules.queue.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
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

    // Constructors
    public LiveVisitQueue() {}

    public LiveVisitQueue(Long patientScheduleId, Long consultingDoctorId, Long branchId, 
                         Long patientId, LocalDateTime checkinTime, Integer plannedSequence, 
                         Integer actualSequence, LocalDateTime estimatedConsultationTime) {
        this.patientScheduleId = patientScheduleId;
        this.consultingDoctorId = consultingDoctorId;
        this.branchId = branchId;
        this.patientId = patientId;
        this.checkinTime = checkinTime;
        this.plannedSequence = plannedSequence;
        this.actualSequence = actualSequence;
        this.estimatedConsultationTime = estimatedConsultationTime;
    }

    // Getters and Setters
    public Long getPatientScheduleId() {
        return patientScheduleId;
    }

    public void setPatientScheduleId(Long patientScheduleId) {
        this.patientScheduleId = patientScheduleId;
    }

    public Long getConsultingDoctorId() {
        return consultingDoctorId;
    }

    public void setConsultingDoctorId(Long consultingDoctorId) {
        this.consultingDoctorId = consultingDoctorId;
    }

    public Long getBranchId() {
        return branchId;
    }

    public void setBranchId(Long branchId) {
        this.branchId = branchId;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public LocalDateTime getCheckinTime() {
        return checkinTime;
    }

    public void setCheckinTime(LocalDateTime checkinTime) {
        this.checkinTime = checkinTime;
    }

    public Integer getPlannedSequence() {
        return plannedSequence;
    }

    public void setPlannedSequence(Integer plannedSequence) {
        this.plannedSequence = plannedSequence;
    }

    public Integer getActualSequence() {
        return actualSequence;
    }

    public void setActualSequence(Integer actualSequence) {
        this.actualSequence = actualSequence;
    }

    public LocalDateTime getEstimatedConsultationTime() {
        return estimatedConsultationTime;
    }

    public void setEstimatedConsultationTime(LocalDateTime estimatedConsultationTime) {
        this.estimatedConsultationTime = estimatedConsultationTime;
    }
}
