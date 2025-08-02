package com.jee.clinichub.app.admin.clinic.clinicType.model;

import java.io.Serializable;

import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "clinic_type")
public class ClinicType extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
   

    public ClinicType(ClinicTypeDto clinicTypeDto) {
        this.id = clinicTypeDto.getId();
        this.name = clinicTypeDto.getName();
        this.description = clinicTypeDto.getDescription();
       

    }

}
 