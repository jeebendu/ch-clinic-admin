package com.jee.clinichub.app.appointment.visitLabOrder.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jee.clinichub.app.appointment.labtest.model.LabTest;
import com.jee.clinichub.app.appointment.visitLabOrder.model.LabOrder;
import com.jee.clinichub.app.appointment.visitLabOrder.model.LabOrderDTO;
import com.jee.clinichub.app.appointment.visitLabOrder.model.LabOrderStatus;
import com.jee.clinichub.app.appointment.visitLabOrder.repository.LabOrderRepo;
import com.jee.clinichub.app.appointment.visitLabResult.model.LabResult;
import com.jee.clinichub.app.appointment.visitLabResult.model.LabResultDTO;
import com.jee.clinichub.app.invoice.model.Invoice;
import com.jee.clinichub.app.invoice.model.InvoiceDTO;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.app.patient.schedule.model.Schedule;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LabOrderServiceImpl implements LabOrderService {

    private final LabOrderRepo labOrderRepository;

    @Override
    public List<LabOrderDTO> getAll() {
        List<LabOrder> labOrders = labOrderRepository.findAll();
        return labOrders.stream().map(LabOrderDTO::new).collect(Collectors.toList());
    }

    @Override
    public LabOrderDTO getById(Long id) {
        Optional<LabOrder> labOrder = labOrderRepository.findById(id);
        if (labOrder.isPresent()) {
            return new LabOrderDTO(labOrder.get());
        }
        throw new RuntimeException("LabOrder not found with ID: " + id);
    }

    @Override
    public Status saveOrUpdate(LabOrderDTO labOrderDTO) {
        try {
            LabOrder labOrder = labOrderDTO.getId() == null ? new LabOrder(labOrderDTO) : setLabOrder(labOrderDTO);
            labOrderRepository.save(labOrder);
            return new Status(true, (labOrderDTO.getId() == null ? "Added" : "Updated") + " Successfully");
        } catch (Exception e) {
            return new Status(false, "Failed to save or update LabOrder: " + e.getMessage());
        }
    }

    public LabOrder setLabOrder(LabOrderDTO labOrderDTO) {
        LabOrder existLab = labOrderRepository.findById(labOrderDTO.getId()).orElseThrow(() -> {
            throw new EntityNotFoundException("Lab Order Not Found With Id :" + labOrderDTO.getId());
        });
        existLab.setNotes(labOrderDTO.getNotes());
        existLab.setLabtest(new LabTest(labOrderDTO.getLabtest()));
        existLab.setStatus(labOrderDTO.getStatus());
        existLab.setPriority(labOrderDTO.getPriority());

        // === LabResult ===
        List<LabResult> labResultExist = existLab.getLabresults();
        List<Long> dtoLabResultIds = labOrderDTO.getLabresults().stream()
                .map(LabResultDTO::getId)
                .collect(Collectors.toList());
        labResultExist.removeIf(existing -> !dtoLabResultIds.contains(existing.getId()));
        labOrderDTO.getLabresults().forEach(dto -> {
            LabResult labresult = labResultExist.stream()
                    .filter(existing -> existing.getId() != null && existing.getId().equals(dto.getId()))
                    .findFirst()
                    .map(existing -> updateLabResult(existing, dto))
                    .orElseGet(() -> createLabResult(dto, existLab));
            if (!labResultExist.contains(labresult)) {
                labResultExist.add(labresult);
            }
        });

        return existLab;
    }

    public LabResult updateLabResult(LabResult existingLabResult, LabResultDTO labResultDTO) {
        existingLabResult.setLabOrder(new LabOrder(labResultDTO.getLabOrder()));
        existingLabResult.setResult(labResultDTO.getResult());
        existingLabResult.setUnit(labResultDTO.getUnit());
        existingLabResult.setNotes(labResultDTO.getNotes());
        existingLabResult.setStatus(labResultDTO.getStatus());
        return existingLabResult;
    }

    public LabResult createLabResult(LabResultDTO dto, LabOrder labOrder) {
        LabResult labResult = new LabResult(dto);
        labResult.setLabOrder(labOrder);
        return labResult;
    }

    @Override
    public Status deleteById(Long id) {
        try {
            Optional<LabOrder> labOrder = labOrderRepository.findById(id);
            if (!labOrder.isPresent()) {
                return new Status(false, "LabOrder not found with ID: " + id);
            }
            labOrderRepository.deleteById(id);
            return new Status(true, "Deleted Successfully");
        } catch (Exception e) {
            return new Status(false, "Failed to delete LabOrder: " + e.getMessage());
        }
    }

    @Override
    public Status updateStatus(Long id) {
        try {
            Optional<LabOrder> labOrder = labOrderRepository.findById(id);
            if (!labOrder.isPresent()) {
                return new Status(false, "LabOrder not found with ID: " + id);
            }
            LabOrder existingLabOrder = labOrder.get();
            existingLabOrder.setStatus(LabOrderStatus.Completed);
            labOrderRepository.save(existingLabOrder);
            return new Status(true, "Status updated successfully");
        } catch (Exception e) {
            return new Status(false, "Failed to update status: " + e.getMessage());
        }
    }

    @Override
    public List<LabOrderDTO> findAllByPatientId(Long patientId) {
       List<LabOrder> labOrders =labOrderRepository.findAllByVisit_patient_id(patientId);
       return labOrders.stream().map(LabOrderDTO::new).collect(Collectors.toList());
    }
}