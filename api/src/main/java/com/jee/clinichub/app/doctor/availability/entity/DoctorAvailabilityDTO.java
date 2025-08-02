package com.jee.clinichub.app.doctor.availability.entity;

import java.time.LocalTime;

import org.checkerframework.checker.units.qual.Time;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorAvailabilityDTO {
        
    private Long id;

    private DayOfWeek dayOfWeek;

    private LocalTime startTime;

    private LocalTime endTime;
    
public DoctorAvailabilityDTO(DoctorAvailability availability){
    this.id = availability.getId();
    this.dayOfWeek=availability.getDayOfWeek();
    this.startTime = availability.getStartTime();
    this.endTime=availability.getEndTime();
}

}
