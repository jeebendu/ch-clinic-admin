package com.jee.clinichub.app.doctor.medicalCourse.model;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Data
public class MedicalCourseDto {


    private Long id;
    private String name;

    
    public MedicalCourseDto(MedicalCourse medicalCourse){
        this.id=medicalCourse.getId();
        this.name=medicalCourse.getName();
    }
}
