
package com.jee.clinichub.app.patient.queue.entity;

import java.time.LocalDateTime;

import com.jee.clinichub.app.patient.queue.dto.QueueItemDto;

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

    @Column(name = "patient_name")
    private String patientName;

    @Column(name = "patient_age")
    private Integer patientAge;

    @Column(name = "patient_gender")
    private String patientGender;

    @Column(name = "patient_mobile")
    private String patientMobile;

    @Column(name = "checkin_time")
    private LocalDateTime checkinTime;

    @Column(name = "planned_sequence")
    private Integer plannedSequence;

    @Column(name = "actual_sequence")
    private Integer actualSequence;

    @Column(name = "estimated_consultation_time")
    private LocalDateTime estimatedConsultationTime;
    
    
 // Convert DTO -> Entity
    public static LiveVisitQueue toEntity(QueueItemDto dto) {
        LiveVisitQueue entity = new LiveVisitQueue();
        entity.setPatientScheduleId(dto.getPatientScheduleId());
        entity.setConsultingDoctorId(dto.getConsultingDoctorId());
        entity.setBranchId(dto.getBranchId());
        entity.setPatientId(dto.getPatientId());
        entity.setPatientName(dto.getPatientName());
        entity.setPatientAge(dto.getPatientAge());
        entity.setPatientGender(dto.getPatientGender());
        entity.setPatientMobile(dto.getPatientMobile());
        entity.setCheckinTime(dto.getCheckinTime());
        entity.setPlannedSequence(dto.getPlannedSequence());
        entity.setActualSequence(dto.getActualSequence());
        entity.setEstimatedConsultationTime(dto.getEstimatedConsultationTime());
        return entity;
    }

    private static String calculateStatus(LiveVisitQueue entity) {
        // Example rule: before consultation time = WAITING, else = COMPLETED
        if (entity.getEstimatedConsultationTime() != null &&
            entity.getEstimatedConsultationTime().isBefore(LocalDateTime.now())) {
            return "COMPLETED";
        }
        return "WAITING";
    }

}

