package com.jee.clinichub.app.doctor.medical_Degree.model;

import java.io.Serializable;

import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;



@Table(name = "medical_degree")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Data
public class MedicalDegree  extends Auditable<String>  implements Serializable{


     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

     @Column(name = "name")
    private String name;


    public MedicalDegree(MedicalDegreeDto medicalCouncilDto){
        this.id=medicalCouncilDto.getId();
        this.name=medicalCouncilDto.getName();
    }
    
}
