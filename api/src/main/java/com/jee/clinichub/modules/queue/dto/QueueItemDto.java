
package com.jee.clinichub.modules.queue.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

public class QueueItemDto {

    @JsonProperty("patient_schedule_id")
    private Long patientScheduleId;

    @JsonProperty("consulting_doctor_id")
    private Long consultingDoctorId;

    @JsonProperty("branch_id")
    private Long branchId;

    @JsonProperty("patient_id")
    private Long patientId;

    @JsonProperty("checkin_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime checkinTime;

    @JsonProperty("planned_sequence")
    private Integer plannedSequence;

    @JsonProperty("actual_sequence")
    private Integer actualSequence;

    @JsonProperty("estimated_consultation_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime estimatedConsultationTime;

    @JsonProperty("waiting_minutes")
    private Long waitingMinutes;

    @JsonProperty("status")
    private String status;

    // Constructors
    public QueueItemDto() {}

    public QueueItemDto(Long patientScheduleId, Long consultingDoctorId, Long branchId,
                       Long patientId, LocalDateTime checkinTime, Integer plannedSequence,
                       Integer actualSequence, LocalDateTime estimatedConsultationTime,
                       Long waitingMinutes, String status) {
        this.patientScheduleId = patientScheduleId;
        this.consultingDoctorId = consultingDoctorId;
        this.branchId = branchId;
        this.patientId = patientId;
        this.checkinTime = checkinTime;
        this.plannedSequence = plannedSequence;
        this.actualSequence = actualSequence;
        this.estimatedConsultationTime = estimatedConsultationTime;
        this.waitingMinutes = waitingMinutes;
        this.status = status;
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

    public Long getWaitingMinutes() {
        return waitingMinutes;
    }

    public void setWaitingMinutes(Long waitingMinutes) {
        this.waitingMinutes = waitingMinutes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
