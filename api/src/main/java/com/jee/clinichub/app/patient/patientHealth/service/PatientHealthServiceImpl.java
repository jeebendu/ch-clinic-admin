package com.jee.clinichub.app.patient.patientHealth.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jee.clinichub.app.patient.patientHealth.model.PatientHealth;
import com.jee.clinichub.app.patient.patientHealth.model.PatientHealthDTO;
import com.jee.clinichub.app.patient.patientHealth.repository.PatientHealthRepo;
import com.jee.clinichub.global.model.Status;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PatientHealthServiceImpl  implements PatientHealthService{

    public final PatientHealthRepo patientHealthRepo;

    public List <PatientHealthDTO> findByPatientId(Long patientId) {
        if (patientId == null) {
            throw new RuntimeException("Patient ID cannot be null");
        }
      return patientHealthRepo.findByPatient_id(patientId).stream().map(PatientHealthDTO::new).toList();

    }

    @Override
    public Status saveOrUpdate(PatientHealthDTO patientHealthDTO) {
        try {
            PatientHealth patientHealth = patientHealthDTO.getId() == null ? new PatientHealth(patientHealthDTO): setPatientHealthInfo(patientHealthDTO);
            patientHealthRepo.save(patientHealth);

            return new Status(true, patientHealthDTO.getId() !=null ? "Updated Successfully":"Saved Successfully");
        } catch (Exception e) {
            return new Status(false, "Something went wrong");
        }
    }

    
    public PatientHealth setPatientHealthInfo(PatientHealthDTO patientHealthDTO) {
        PatientHealth patientHealth = patientHealthRepo.findById(patientHealthDTO.getId()).orElseThrow(() -> {
            throw new RuntimeException("Patient-Health not found");
        });
        patientHealth.setHeight(patientHealthDTO.getHeight());
        patientHealth.setWeight(patientHealthDTO.getWeight());
        patientHealth.setBloodGroup(patientHealthDTO.getBloodGroup());
        patientHealth.setAllergies(patientHealthDTO.getAllergies());
        patientHealth.setCurrentMedication(patientHealthDTO.getCurrentMedication());
        patientHealth.setBloodPressure(patientHealthDTO.getBloodPressure());
        patientHealth.setHeartRate(patientHealthDTO.getHeartRate());
        patientHealth.setCholesterol(patientHealthDTO.getCholesterol());
        patientHealth.setBloodSugar(patientHealthDTO.getBloodSugar());

        
        return patientHealth;
    }

    @Override
    public Status delete(Long id) {
        patientHealthRepo.findById(id).ifPresentOrElse(patientHealthRepo::delete, () -> {
            throw new RuntimeException("Patient Health not found");
        });
        return new Status(true, "Patient Health Deleted Successfully");
    }

   
}
