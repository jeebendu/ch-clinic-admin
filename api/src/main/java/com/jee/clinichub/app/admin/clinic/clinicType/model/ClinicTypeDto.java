package com.jee.clinichub.app.admin.clinic.clinicType.model;

import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClinicTypeDto {
    private Long id;

    private String name;
    private String description;
   

     public ClinicTypeDto(ClinicType clinicTypeDto) {
        if(clinicTypeDto.getId()!=null){
            this.id = clinicTypeDto.getId();
        }
        this.name = clinicTypeDto.getName();
        this.description = clinicTypeDto.getDescription();
       

}
}