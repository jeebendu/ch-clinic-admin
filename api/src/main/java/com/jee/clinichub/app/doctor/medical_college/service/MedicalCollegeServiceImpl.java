package com.jee.clinichub.app.doctor.medical_college.service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.core.state.model.State;
import com.jee.clinichub.app.doctor.medical_college.model.MedicalCollege;
import com.jee.clinichub.app.doctor.medical_college.model.MedicalCollegeDto;
import com.jee.clinichub.app.doctor.medical_college.repository.MedicalCollegeRepo;
import com.jee.clinichub.app.doctor.medical_university.model.MedicalUniversity;
import com.jee.clinichub.global.model.Status;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class MedicalCollegeServiceImpl implements MedicalCollegeService {

    @Autowired
    MedicalCollegeRepo medicalCollegeRepo;

    @Override
    public List<MedicalCollegeDto> getAllMedicalCollege() {

        return medicalCollegeRepo.findAll().stream().map(MedicalCollegeDto::new).toList();
    }

    @Override
    public Status saveOrUpdate(MedicalCollegeDto medicalCollegeDto) {
        try {
            boolean isExists = medicalCollegeRepo.existsByNameIgnoreCaseAndIdNot(medicalCollegeDto.getName(),
                    medicalCollegeDto.getId() != null ? medicalCollegeDto.getId() : -1);
            if (isExists) {
                return new Status(false, "Medical College already exists with name: " + medicalCollegeDto.getName());
            }

            MedicalCollege medicalCollege = medicalCollegeDto.getId() == null ? new MedicalCollege(medicalCollegeDto)
                    : setMedicalCollege(medicalCollegeDto);

            medicalCollegeRepo.save(medicalCollege);
            return new Status(true, "Medical College saved successfully!");

        } catch (Exception e) {
            return new Status(false, "Some thing went wrong!");
        }
    }

    public MedicalCollege setMedicalCollege(MedicalCollegeDto medicalCollegeDto) {
        MedicalCollege medicalCollege = medicalCollegeRepo.findById(medicalCollegeDto.getId()).get();
        medicalCollege.setName(medicalCollegeDto.getName());
        medicalCollege.setState(new State(medicalCollegeDto.getState()));
        medicalCollege.setUniversity(new MedicalUniversity(medicalCollegeDto.getUniversity()));

        return medicalCollege;
    }

    @Override
    public Status deleteById(Long id) {
        medicalCollegeRepo.findById(id).ifPresentOrElse((data) -> {
            medicalCollegeRepo.deleteById(id);
        }, () -> {
            throw new EntityNotFoundException("Medical College not found with id: " + id);
        });
        return new Status(true, "Medical College deleted successfully!");
    }

    @Override
    public List<MedicalCollegeDto> getMedicalCollegeByName(String name) {
        List<MedicalCollegeDto> results = new ArrayList<MedicalCollegeDto>();
        try {
            if (name == null || name.equals("")) {
                return results;
            }
           return medicalCollegeRepo.filterAllByName(name).stream()
                    .map(MedicalCollegeDto::new)
                    .toList();
        } catch (Exception e) {
            return results;
        }
    }

}
