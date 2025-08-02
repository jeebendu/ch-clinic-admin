package com.jee.clinichub.app.appointment.patientSymptoms.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.appointment.patientSymptoms.model.PatientSymptoms;
import com.jee.clinichub.app.appointment.patientSymptoms.model.PatientSymptomsDto;
import com.jee.clinichub.app.appointment.patientSymptoms.repository.PatientSymptomsRepo;
import com.jee.clinichub.app.appointment.symptoms.model.Symptoms;
import com.jee.clinichub.app.patient.schedule.model.Schedule;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
public class PatientSymptomsServiceImpl implements PatientSymptomsService {

    @Autowired
    private PatientSymptomsRepo symptomsRepo;

    @Override
    public PatientSymptomsDto saveOrUpdate(PatientSymptomsDto symptomsDto) {
        try {
            PatientSymptoms symptoms = symptomsDto.getId() == null
                    ? new PatientSymptoms(symptomsDto)
                    : symptomsRepo.findById(symptomsDto.getId())
                            .map(existing -> updateSymptoms(existing, symptomsDto))
                            .orElseThrow(() -> new EntityNotFoundException(
                                    "Patient Symptom not found with id " + symptomsDto.getId()));

            PatientSymptoms savedEntity = symptomsRepo.save(symptoms);
            return new PatientSymptomsDto(savedEntity);
        } catch (Exception e) {
            log.error("Error saving or updating PatientSymptoms: {}", e.getMessage());
            throw new RuntimeException("Failed to save or update PatientSymptoms");
        }
    }

    @Override
    public PatientSymptomsDto getById(Long id) {
        return symptomsRepo.findById(id)
                .map(PatientSymptomsDto::new)
                .orElseThrow(() -> new EntityNotFoundException("Patient Symptom not found with id " + id));
    }

    @Override
    public List<PatientSymptomsDto> findAll() {
        return symptomsRepo.findAll().stream()
                .map(PatientSymptomsDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<PatientSymptomsDto> findAllByVisitId(Long visitId) {
        return symptomsRepo.findAllByVisit_id(visitId).stream()
                .map(PatientSymptomsDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public Status deleteById(Long id) {
        try {
            symptomsRepo.findById(id).ifPresentOrElse(symptomsRepo::delete, () -> {
                throw new EntityNotFoundException("Patient Symptom not found with id " + id);
            });
            return new Status(true, "Deleted successfully");
        } catch (Exception e) {
            log.error("Error deleting PatientSymptoms: {}", e.getMessage());
            throw new RuntimeException("Failed to delete PatientSymptoms");
        }
    }

    private PatientSymptoms updateSymptoms(PatientSymptoms existing, PatientSymptomsDto dto) {
        existing.setVisit(new Schedule(dto.getVisit()));
        existing.setSymptoms(new Symptoms(dto.getSymptoms()));
        existing.setSeverity(dto.getSeverity());
        return existing;
    }
}
