
package com.jee.clinichub.app.doctor.medicalCourse.model;


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

@Table(name = "medical_course")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Data
public class MedicalCourse extends Auditable<String>  implements Serializable{


     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

     @Column(name = "name")
    private String name;


    public MedicalCourse(MedicalCourseDto medicalCourseDto){
        this.id=medicalCourseDto.getId();
        this.name=medicalCourseDto.getName();
    }
    
}
