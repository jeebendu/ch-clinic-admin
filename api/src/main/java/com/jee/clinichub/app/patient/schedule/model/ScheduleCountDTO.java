package com.jee.clinichub.app.patient.schedule.model;

import com.jee.clinichub.app.doctor.model.Doctor;
import java.util.Date;
import lombok.Data;


@Data
public class ScheduleCountDTO {
    
    private Doctor refDoctor;
    private Long numberOfSchedules;
    private Date createdTime;

    public ScheduleCountDTO(Doctor doctor, Long numberOfSchedules, Object createdTime) {
        this.refDoctor = doctor;
        this.numberOfSchedules = numberOfSchedules;
        this.createdTime = (Date) createdTime; // Cast Object to Date

    }
    public Doctor getRefDoctor() {
        return refDoctor;
    }

}
