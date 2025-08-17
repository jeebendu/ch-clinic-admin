
package com.jee.clinichub.app.patient.queue.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
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

}
