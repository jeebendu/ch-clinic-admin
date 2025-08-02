package com.jee.clinichub.app.doctor.medical_university.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.jee.clinichub.app.doctor.medical_university.model.MedicalUniversity;
import com.jee.clinichub.app.doctor.medical_university.model.MedicalUniversityDto;
import com.jee.clinichub.app.doctor.medical_university.repository.MedicalUniversityRepo;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class  MedicalUniversityServiceImpl implements MedicalUniversityService {

    @Autowired
    MedicalUniversityRepo medicalUniversityRepo;

    @Override
    public List<MedicalUniversityDto> getAllMedicalUniversity() {

        return medicalUniversityRepo.findAll().stream().map(MedicalUniversityDto::new).toList();
    }

    @Override
    public Status saveOrUpdate(MedicalUniversityDto medicalUniversityDto) {
        try {
            boolean isExists = medicalUniversityRepo.existsByNameIgnoreCaseAndIdNot(medicalUniversityDto.getName(),
            medicalUniversityDto.getId() != null ? medicalUniversityDto.getId() : -1);
            if (isExists) {
                return new Status(false, "Medical Council already exists with name: " + medicalUniversityDto.getName());
            }

            MedicalUniversity medicalUniversity = medicalUniversityDto.getId() == null ? new MedicalUniversity(medicalUniversityDto)
                    : setMedicalUniversity(medicalUniversityDto);

                    medicalUniversityRepo.save(medicalUniversity);
            return new Status(true, "Medical Council saved successfully!");

        } catch (Exception e) {
            return new Status(false, "Some thing went wrong!");
        }
    }

    public MedicalUniversity setMedicalUniversity(MedicalUniversityDto medicalUniversityDto) {
        MedicalUniversity medicalUniversity = medicalUniversityRepo.findById(medicalUniversityDto.getId()).get();
        medicalUniversity.setName(medicalUniversityDto.getName());
        return medicalUniversity;
    }

    @Override
    public Status deleteById(Long id) {
        medicalUniversityRepo.findById(id).ifPresentOrElse((data) -> {
            medicalUniversityRepo.deleteById(id);
        }, () -> {
            throw new EntityNotFoundException("Medical Council not found with id: " + id);
        });
        return new Status(true, "Medical Council deleted successfully!");
    }

    @Override
    public List<MedicalUniversityDto> getMedicalUniversityByName(String name) {
        List<MedicalUniversityDto> results = new ArrayList<MedicalUniversityDto>();
        try {
            if (name == null || name.equals("")) {
                return results;
            }
            results = medicalUniversityRepo.findAllByNameContainingIgnoreCase(name).stream()
                    .map(MedicalUniversityDto::new)
                    .toList();
        } catch (Exception e) {
        }
        return results;
    }

}
