package com.jee.clinichub.app.doctor.medical_Council.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.doctor.medical_Council.model.MedicalCouncil;
import com.jee.clinichub.app.doctor.medical_Council.model.MedicalCouncilDto;
import com.jee.clinichub.app.doctor.medical_Council.repository.MedicalCouncilRepo;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class MedicalCouncilServiceImpl implements MedicalCouncilService {

    @Autowired
    MedicalCouncilRepo medicalCouncilRepo;

    @Override
    public List<MedicalCouncilDto> getAllMedicalCouncil() {

        return medicalCouncilRepo.findAll().stream().map(MedicalCouncilDto::new).toList();
    }

    @Override
    public Status saveOrUpdate(MedicalCouncilDto medicalCouncilDto) {
        try {
            boolean isExists = medicalCouncilRepo.existsByNameIgnoreCaseAndIdNot(medicalCouncilDto.getName(),
                    medicalCouncilDto.getId() != null ? medicalCouncilDto.getId() : -1);
            if (isExists) {
                return new Status(false, "Medical Council already exists with name: " + medicalCouncilDto.getName());
            }

            MedicalCouncil medicalCouncil = medicalCouncilDto.getId() == null ? new MedicalCouncil(medicalCouncilDto)
                    : setMedicalCouncil(medicalCouncilDto);

            medicalCouncilRepo.save(medicalCouncil);
            return new Status(true, "Medical Council saved successfully!");

        } catch (Exception e) {
            return new Status(false, "Some thing went wrong!");
        }
    }

    public MedicalCouncil setMedicalCouncil(MedicalCouncilDto medicalCouncilDto) {
        MedicalCouncil medicalCouncil = medicalCouncilRepo.findById(medicalCouncilDto.getId()).get();
        medicalCouncil.setName(medicalCouncilDto.getName());
        return medicalCouncil;
    }

    @Override
    public Status deleteById(Long id) {
        medicalCouncilRepo.findById(id).ifPresentOrElse((data) -> {
            medicalCouncilRepo.deleteById(id);
        }, () -> {
            throw new EntityNotFoundException("Medical Council not found with id: " + id);
        });
        return new Status(true, "Medical Council deleted successfully!");
    }

    @Override
    public List<MedicalCouncilDto> getMedicalCouncilsByName(String name) {
        List<MedicalCouncilDto> results = new ArrayList<MedicalCouncilDto>();
        try {
            if (name == null || name.equals("")) {
                return results;
            }
            results = medicalCouncilRepo.findAllByNameContainingIgnoreCase(name).stream()
                    .map(MedicalCouncilDto::new)
                    .toList();
        } catch (Exception e) {
        }
        return results;
    }

}
