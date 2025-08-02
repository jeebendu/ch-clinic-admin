package com.jee.clinichub.app.doctor.specialization.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class SpecializationDoctorCount {


    private Long id;

    private String name;
    
    private String icon;
    private boolean active;
    private Long doctorCount;

    public SpecializationDoctorCount( Specialization specialization){
        this.id = specialization.getId();
        this.name = specialization.getName();
        this.icon = specialization.getIcon();
        this.active = specialization.isActive();

    }
    
}
