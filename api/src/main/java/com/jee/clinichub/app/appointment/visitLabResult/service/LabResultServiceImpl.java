package com.jee.clinichub.app.appointment.visitLabResult.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jee.clinichub.app.appointment.visitLabOrder.model.LabOrder;
import com.jee.clinichub.app.appointment.visitLabResult.model.LabResult;
import com.jee.clinichub.app.appointment.visitLabResult.model.LabResultDTO;
import com.jee.clinichub.app.appointment.visitLabResult.repository.LabResultRepo;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LabResultServiceImpl implements LabResultService {

    private final LabResultRepo labResultRepository;

    @Override
    public List<LabResultDTO> getAll() {
        List<LabResult> labResults = labResultRepository.findAll();
        return labResults.stream().map(LabResultDTO::new).collect(Collectors.toList());
    }

    @Override
    public LabResultDTO getById(Long id) {
        Optional<LabResult> labResult = labResultRepository.findById(id);
        if (labResult.isPresent()) {
            return new LabResultDTO(labResult.get());
        }
        throw new RuntimeException("LabResult not found with ID: " + id);
    }

    @Override
    public Status saveOrUpdate(LabResultDTO labResultDTO) {
        try {
            LabResult labResult = labResultDTO.getId() == null ? new LabResult(labResultDTO) : updateLabResult(labResultDTO);
            labResultRepository.save(labResult);
            return new Status(true, (labResultDTO.getId() == null ? "Added" : "Updated") + " Successfully");
        } catch (Exception e) {
            return new Status(false, "Failed to save or update LabResult: " + e.getMessage());
        }
    }

    private LabResult updateLabResult(LabResultDTO labResultDTO) {
        LabResult existingLabResult = labResultRepository.findById(labResultDTO.getId()).orElseThrow(() -> {
            throw new EntityNotFoundException("LabResult not found with ID: " + labResultDTO.getId());
        });
        existingLabResult.setLabOrder(new LabOrder(labResultDTO.getLabOrder()));
        existingLabResult.setResult(labResultDTO.getResult());
        existingLabResult.setUnit(labResultDTO.getUnit());
        existingLabResult.setNotes(labResultDTO.getNotes());
        existingLabResult.setStatus(labResultDTO.getStatus());
        return existingLabResult;
    }

    @Override
    public Status deleteById(Long id) {
        try {
            Optional<LabResult> labResult = labResultRepository.findById(id);
            if (!labResult.isPresent()) {
                return new Status(false, "LabResult not found with ID: " + id);
            }
            labResultRepository.deleteById(id);
            return new Status(true, "Deleted Successfully");
        } catch (Exception e) {
            return new Status(false, "Failed to delete LabResult: " + e.getMessage());
        }
    }
}