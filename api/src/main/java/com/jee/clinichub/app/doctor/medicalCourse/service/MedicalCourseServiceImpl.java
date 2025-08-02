package com.jee.clinichub.app.doctor.medicalCourse.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.doctor.medicalCourse.model.MedicalCourse;
import com.jee.clinichub.app.doctor.medicalCourse.model.MedicalCourseDto;
import com.jee.clinichub.app.doctor.medicalCourse.repository.MedicalCourseRepo;

import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class MedicalCourseServiceImpl implements MedicalCourseService {

    @Autowired
    MedicalCourseRepo medicalCourseRepo;

    @Override
    public List<MedicalCourseDto> getAllMedicalCourse() {

        return medicalCourseRepo.findAll().stream().map(MedicalCourseDto::new).toList();
    }

    @Override
    public Status saveOrUpdate(MedicalCourseDto medicalCourseDto) {
        try {
            boolean isExists = medicalCourseRepo.existsByNameIgnoreCaseAndIdNot(medicalCourseDto.getName(),
            medicalCourseDto.getId() != null ? medicalCourseDto.getId() : -1);
            if (isExists) {
                return new Status(false, "Medical Council already exists with name: " + medicalCourseDto.getName());
            }

            MedicalCourse medicalCourse = medicalCourseDto.getId() == null ? new MedicalCourse(medicalCourseDto)
                    : setMedicalCourse(medicalCourseDto);

            medicalCourseRepo.save(medicalCourse);
            return new Status(true, "Medical Council saved successfully!");

        } catch (Exception e) {
            return new Status(false, "Some thing went wrong!");
        }
    }

    public MedicalCourse setMedicalCourse(MedicalCourseDto medicalCourseDto) {
        MedicalCourse medicalCourse = medicalCourseRepo.findById(medicalCourseDto.getId()).get();
        medicalCourse.setName(medicalCourseDto.getName());
        return medicalCourse;
    }

    @Override
    public Status deleteById(Long id) {
        medicalCourseRepo.findById(id).ifPresentOrElse((data) -> {
            medicalCourseRepo.deleteById(id);
        }, () -> {
            throw new EntityNotFoundException("Medical Council not found with id: " + id);
        });
        return new Status(true, "Medical Council deleted successfully!");
    }

    @Override
    public List<MedicalCourseDto> getAllMedicalCourseName(String name) {
        List<MedicalCourseDto> results = new ArrayList<MedicalCourseDto>();
        try {
            if (name == null || name.equals("")) {
                return results;
            }
            results = medicalCourseRepo.findAllByNameContainingIgnoreCase(name).stream()
                    .map(MedicalCourseDto::new)
                    .toList();
        } catch (Exception e) {
        }
        return results;
    }

}
