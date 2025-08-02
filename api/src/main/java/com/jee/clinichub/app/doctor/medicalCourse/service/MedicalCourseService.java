package com.jee.clinichub.app.doctor.medicalCourse.service;

import java.util.List;

import com.jee.clinichub.app.doctor.medicalCourse.model.MedicalCourseDto;
import com.jee.clinichub.app.doctor.medical_Council.model.MedicalCouncilDto;
import com.jee.clinichub.global.model.Status;

public interface MedicalCourseService {

    List<MedicalCourseDto> getAllMedicalCourse();

    Status saveOrUpdate(MedicalCourseDto medicalCourseDto);

    Status deleteById(Long id);

    List<MedicalCourseDto> getAllMedicalCourseName(String name);
}
