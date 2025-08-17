
package com.jee.clinichub.app.patient.queue.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.jee.clinichub.app.patient.queue.entity.LiveVisitQueue;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class QueueItemDto {

    @JsonProperty("patient_schedule_id")
    private Long patientScheduleId;

    @JsonProperty("consulting_doctor_id")
    private Long consultingDoctorId;

    @JsonProperty("branch_id")
    private Long branchId;

    @JsonProperty("patient_id")
    private Long patientId;

    @JsonProperty("patient_name")
    private String patientName;

    @JsonProperty("patient_age")
    private Integer patientAge;

    @JsonProperty("patient_gender")
    private String patientGender;

    @JsonProperty("patient_mobile")
    private String patientMobile;

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
    
    
 // Convert Entity -> DTO
    public static QueueItemDto toDto(LiveVisitQueue entity) {
        return QueueItemDto.builder()
                .patientScheduleId(entity.getPatientScheduleId())
                .consultingDoctorId(entity.getConsultingDoctorId())
                .branchId(entity.getBranchId())
                .patientId(entity.getPatientId())
                .patientName(entity.getPatientName())
                .patientAge(entity.getPatientAge())
                .patientGender(entity.getPatientGender())
                .patientMobile(entity.getPatientMobile())
                .checkinTime(entity.getCheckinTime())
                .plannedSequence(entity.getPlannedSequence())
                .actualSequence(entity.getActualSequence())
                .estimatedConsultationTime(entity.getEstimatedConsultationTime())
                .build();
    }
    
    
}

