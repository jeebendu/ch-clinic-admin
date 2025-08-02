package com.jee.clinichub.app.appointment.visitMedicines.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jee.clinichub.app.appointment.visitMedicines.model.Medicines;
import com.jee.clinichub.app.appointment.visitMedicines.model.MedicinesDTO;
import com.jee.clinichub.app.appointment.visitMedicines.repository.VisitMedicineRepo;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class VisitMedicinServiceImpl implements VisitMedicinService {

    private final VisitMedicineRepo vMedicineRepo;

    @Override
    public List<MedicinesDTO> findAllByVisitId(Long visitId) {
        try {
            return vMedicineRepo.findAllByVisit_id(visitId).stream()
                    .map(MedicinesDTO::new).toList();
        } catch (Exception e) {
            log.error("Error in findAllByVisitId: {}", e.getLocalizedMessage());
            throw e;
        }
    }

    @Override
    public Status deleteById(Long id) {
        try {
            Optional<Medicines> medicineOpt = vMedicineRepo.findById(id);
            if (medicineOpt.isPresent()) {
                vMedicineRepo.deleteById(id);
                return new Status(true, "Deleted Successfully");
            } else {
                return new Status(false, "Medicine not found with id: " + id);
            }
        } catch (Exception e) {
            log.error("Error in deleteById: {}", e.getLocalizedMessage());
            return new Status(false, "Something went wrong");
        }
    }

    @Override
    public Status saveOrUpdate(MedicinesDTO medicinesDto) {
        try {
            Medicines medicines = medicinesDto.getId() != null
                    ? updateExistingMedicine(medicinesDto)
                    : new Medicines(medicinesDto);
            vMedicineRepo.save(medicines);
            return new Status(true, (medicinesDto.getId() == null ? "Added" : "Updated") + " Successfully");
        } catch (Exception e) {
            log.error("Error in saveOrUpdate: {}", e.getLocalizedMessage());
            return new Status(false, "Something went wrong");
        }
    }

    private Medicines updateExistingMedicine(MedicinesDTO dto) {
        Medicines existing = vMedicineRepo.findById(dto.getId())
                .orElseThrow(() -> new EntityNotFoundException("Medicine not found with id: " + dto.getId()));
        existing.setName(dto.getName());
        existing.setDosage(dto.getDosage());
        existing.setFrequency(dto.getFrequency());
        existing.setDuration(dto.getDuration());
        existing.setTimings(dto.getTimings());
        existing.setInstruction(dto.getInstruction());
        return existing;
    }

    @Override
    public MedicinesDTO getById(Long id) {
        try {
            return vMedicineRepo.findById(id)
                    .map(MedicinesDTO::new)
                    .orElseThrow(() -> new EntityNotFoundException("Medicine not found with id: " + id));
        } catch (Exception e) {
            log.error("Error in getById: {}", e.getLocalizedMessage());
            throw e;
        }
    }

    @Override
    public List<MedicinesDTO> getAll() {
        try {
            return vMedicineRepo.findAll().stream()
                    .map(MedicinesDTO::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error in getAll: {}", e.getLocalizedMessage());
            throw e;
        }
    }
}
