package com.jee.clinichub.app.admin.clinic.clinicFacility.model;

import java.io.Serializable;



import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "clinic_facility")
public class ClinicFacility extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    public ClinicFacility(ClinicFacilityDto clinicFacilityDto) {
        this.id = clinicFacilityDto.getId();
        this.name = clinicFacilityDto.getName();
    }
}
