package com.jee.clinichub.app.admin.clinic.clinicFacility.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor 
public class ClinicFacilityDto {

    private Long id;
    private String name;

    public ClinicFacilityDto(ClinicFacility clinicFacilityDto) {
        this.id = clinicFacilityDto.getId();
        this.name = clinicFacilityDto.getName();
    }
}
