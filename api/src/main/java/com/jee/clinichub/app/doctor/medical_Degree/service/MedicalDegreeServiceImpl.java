package com.jee.clinichub.app.doctor.medical_Degree.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.doctor.medical_Degree.model.MedicalDegree;
import com.jee.clinichub.app.doctor.medical_Degree.model.MedicalDegreeDto;
import com.jee.clinichub.app.doctor.medical_Degree.repository.MedicalDegreeRepo;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class MedicalDegreeServiceImpl implements MedicalDegreeService {

    @Autowired
    MedicalDegreeRepo medicalDegreeRepo;

    @Override
    public List<MedicalDegreeDto> getAllMedicalDegree() {

        return medicalDegreeRepo.findAll().stream().map(MedicalDegreeDto::new).toList();
    }

    @Override
    public Status saveOrUpdate(MedicalDegreeDto medicalDegreeDto) {
        try {
            boolean isExists = medicalDegreeRepo.existsByNameIgnoreCaseAndIdNot(medicalDegreeDto.getName(),
                    medicalDegreeDto.getId() != null ? medicalDegreeDto.getId() : -1);
            if (isExists) {
                return new Status(false, "Medical Degree already exists with name: " + medicalDegreeDto.getName());
            }

            MedicalDegree medicalDegree = medicalDegreeDto.getId() == null ? new MedicalDegree(medicalDegreeDto)
                    : setMedicalDegree(medicalDegreeDto);

            medicalDegreeRepo.save(medicalDegree);
            return new Status(true, "Medical Degree saved successfully!");

        } catch (Exception e) {
            return new Status(false, "Some thing went wrong!");
        }
    }

    public MedicalDegree setMedicalDegree(MedicalDegreeDto medicalDegreeDto) {
        MedicalDegree medicalDegree = medicalDegreeRepo.findById(medicalDegreeDto.getId()).get();
        medicalDegree.setName(medicalDegreeDto.getName());
        return medicalDegree;
    }

    @Override
    public Status deleteById(Long id) {
        medicalDegreeRepo.findById(id).ifPresentOrElse((data) -> {
            medicalDegreeRepo.deleteById(id);
        }, () -> {
            throw new EntityNotFoundException("Medical Degree not found with id: " + id);
        });
        return new Status(true, "Medical Degree deleted successfully!");
    }

    @Override
    public List<MedicalDegreeDto> getMedicalDegreesByName(String name) {
        List<MedicalDegreeDto> results = new ArrayList<MedicalDegreeDto>();
        try {
            if (name == null || name.equals("")) {
                return results;
            }
            results = medicalDegreeRepo.findAllByNameContainingIgnoreCase(name).stream()
                    .map(MedicalDegreeDto::new)
                    .toList();
        } catch (Exception e) {
        }
        return results;
    }

}
