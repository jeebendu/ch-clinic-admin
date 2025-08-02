package com.jee.clinichub.app.doctor.medical_college.model;

import com.jee.clinichub.app.core.state.model.State;
import com.jee.clinichub.app.core.state.model.StateDto;
import com.jee.clinichub.app.doctor.medicalCourse.model.MedicalCourseDto;
import com.jee.clinichub.app.doctor.medical_university.model.MedicalUniversity;
import com.jee.clinichub.app.doctor.medical_university.model.MedicalUniversityDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Data
public class MedicalCollegeDto {

    private Long id;
    private String name;
    private StateDto state;

    private MedicalUniversityDto university;

    public MedicalCollegeDto(MedicalCollege medicalCollege) {
        this.id = medicalCollege.getId();
        this.name = medicalCollege.getName();
        this.state = new StateDto(medicalCollege.getState());
        if(medicalCollege.getUniversity()!=null){
            this.university = new MedicalUniversityDto(medicalCollege.getUniversity());
        }
    }
}
