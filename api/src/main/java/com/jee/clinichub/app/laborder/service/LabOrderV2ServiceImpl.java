package com.jee.clinichub.app.laborder.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jee.clinichub.app.laborder.model.LabOrderV2;
import com.jee.clinichub.app.laborder.model.LabOrderDTO;
import com.jee.clinichub.app.laborder.model.LabOrderItem;
import com.jee.clinichub.app.laborder.model.LabOrderItemDTO;
import com.jee.clinichub.app.laborder.model.enums.LabOrderStatus;
import com.jee.clinichub.app.laborder.repository.LabOrderV2Repository;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.app.patient.repository.PatientRepository;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class LabOrderV2ServiceImpl implements LabOrderV2Service {

    private final LabOrderV2Repository labOrderRepository;
    private final PatientRepository patientRepository;

    @Override
    public List<LabOrderDTO> getAllLabOrders() {
        List<LabOrderV2> labOrders = labOrderRepository.findAll();
        return labOrders.stream().map(LabOrderDTO::new).collect(Collectors.toList());
    }

    @Override
    public LabOrderDTO getLabOrderById(Long id) {
        Optional<LabOrderV2> labOrder = labOrderRepository.findById(id);
        if (labOrder.isPresent()) {
            return new LabOrderDTO(labOrder.get());
        }
        throw new EntityNotFoundException("Lab Order not found with ID: " + id);
    }

    @Override
    public Status saveOrUpdate(LabOrderDTO labOrderDTO) {
        try {
            // Validate branchId is provided
            if (labOrderDTO.getBranchId() == null) {
                return new Status(false, "Branch ID is required");
            }

            // Generate order number if creating new order
            if (labOrderDTO.getId() == null && (labOrderDTO.getOrderNumber() == null || labOrderDTO.getOrderNumber().isEmpty())) {
                generateOrderNumber(labOrderDTO);
            }

            // Validate patient exists
            if (labOrderDTO.getPatient() != null && labOrderDTO.getPatient().getId() != null) {
                Optional<Patient> patient = patientRepository.findById(labOrderDTO.getPatient().getId());
                if (!patient.isPresent()) {
                    return new Status(false, "Patient not found");
                }
            }

            LabOrderV2 labOrder = labOrderDTO.getId() == null ? 
                new LabOrderV2(labOrderDTO) : updateExistingLabOrder(labOrderDTO);
            
            labOrderRepository.save(labOrder);
            return new Status(true, (labOrderDTO.getId() == null ? "Added" : "Updated") + " Successfully");
        } catch (Exception e) {
            log.error("Error saving lab order: ", e);
            return new Status(false, "Failed to save lab order: " + e.getMessage());
        }
    }

    private LabOrderV2 updateExistingLabOrder(LabOrderDTO labOrderDTO) {
        LabOrderV2 existingOrder = labOrderRepository.findById(labOrderDTO.getId())
            .orElseThrow(() -> new EntityNotFoundException("Lab Order not found with ID: " + labOrderDTO.getId()));

        existingOrder.setVisitId(labOrderDTO.getVisitId());
        existingOrder.setBranchId(labOrderDTO.getBranchId());
        existingOrder.setOrderNumber(labOrderDTO.getOrderNumber());
        existingOrder.setStatus(labOrderDTO.getStatus());
        existingOrder.setPriority(labOrderDTO.getPriority());
        existingOrder.setOrderDate(labOrderDTO.getOrderDate());
        existingOrder.setExpectedDate(labOrderDTO.getExpectedDate());
        existingOrder.setReferringDoctor(labOrderDTO.getReferringDoctor());
        existingOrder.setComments(labOrderDTO.getComments());

        // Update lab order items
        List<LabOrderItem> existingItems = existingOrder.getLabOrderItems();
        List<Long> dtoItemIds = labOrderDTO.getLabOrderItems().stream()
                .map(LabOrderItemDTO::getId)
                .collect(Collectors.toList());

        // Remove items not in DTO
        existingItems.removeIf(existing -> !dtoItemIds.contains(existing.getId()));

        // Add or update items
        labOrderDTO.getLabOrderItems().forEach(itemDTO -> {
            LabOrderItem item = existingItems.stream()
                    .filter(existing -> existing.getId() != null && existing.getId().equals(itemDTO.getId()))
                    .findFirst()
                    .map(existing -> updateLabOrderItem(existing, itemDTO))
                    .orElseGet(() -> createLabOrderItem(itemDTO, existingOrder));
            
            if (!existingItems.contains(item)) {
                existingItems.add(item);
            }
        });

        return existingOrder;
    }

    private LabOrderItem updateLabOrderItem(LabOrderItem existing, LabOrderItemDTO dto) {
        existing.setTestTypeId(dto.getTestTypeId());
        existing.setStatus(dto.getStatus());
        existing.setSampleCollected(dto.getSampleCollected());
        existing.setSampleCollectionDate(dto.getSampleCollectionDate());
        return existing;
    }

    private LabOrderItem createLabOrderItem(LabOrderItemDTO dto, LabOrderV2 labOrder) {
        LabOrderItem item = new LabOrderItem(dto);
        item.setLabOrder(labOrder);
        return item;
    }

    @Override
    public Status deleteById(Long id) {
        try {
            Optional<LabOrderV2> labOrder = labOrderRepository.findById(id);
            if (!labOrder.isPresent()) {
                return new Status(false, "Lab Order not found with ID: " + id);
            }
            labOrderRepository.deleteById(id);
            return new Status(true, "Deleted Successfully");
        } catch (Exception e) {
            log.error("Error deleting lab order: ", e);
            return new Status(false, "Failed to delete lab order: " + e.getMessage());
        }
    }

    @Override
    public Status updateStatus(Long id, LabOrderStatus status) {
        try {
            Optional<LabOrderV2> labOrder = labOrderRepository.findById(id);
            if (!labOrder.isPresent()) {
                return new Status(false, "Lab Order not found with ID: " + id);
            }
            LabOrderV2 existingOrder = labOrder.get();
            existingOrder.setStatus(status);
            labOrderRepository.save(existingOrder);
            return new Status(true, "Status updated successfully");
        } catch (Exception e) {
            log.error("Error updating lab order status: ", e);
            return new Status(false, "Failed to update status: " + e.getMessage());
        }
    }

    @Override
    public List<LabOrderDTO> getLabOrdersByPatientId(Long patientId) {
        List<LabOrderV2> labOrders = labOrderRepository.findAllByPatient_id(patientId);
        return labOrders.stream().map(LabOrderDTO::new).collect(Collectors.toList());
    }

    @Override
    public List<LabOrderDTO> getLabOrdersByVisitId(Long visitId) {
        List<LabOrderV2> labOrders = labOrderRepository.findAllByVisitId(visitId);
        return labOrders.stream().map(LabOrderDTO::new).collect(Collectors.toList());
    }

    @Override
    public List<LabOrderDTO> getLabOrdersByBranchId(Long branchId) {
        List<LabOrderV2> labOrders = labOrderRepository.findAllByBranchId(branchId);
        return labOrders.stream().map(LabOrderDTO::new).collect(Collectors.toList());
    }

    @Override
    public List<LabOrderDTO> getLabOrdersByStatus(LabOrderStatus status) {
        List<LabOrderV2> labOrders = labOrderRepository.findAllByStatus(status);
        return labOrders.stream().map(LabOrderDTO::new).collect(Collectors.toList());
    }

    @Override
    public List<LabOrderDTO> getLabOrdersByBranchIdAndStatus(Long branchId, LabOrderStatus status) {
        List<LabOrderV2> labOrders = labOrderRepository.findAllByBranchIdAndStatus(branchId, status);
        return labOrders.stream().map(LabOrderDTO::new).collect(Collectors.toList());
    }

    @Override
    public List<LabOrderDTO> getLabOrdersByPatientIdAndBranchId(Long patientId, Long branchId) {
        List<LabOrderV2> labOrders = labOrderRepository.findAllByPatient_idAndBranchId(patientId, branchId);
        return labOrders.stream().map(LabOrderDTO::new).collect(Collectors.toList());
    }

    @Override
    public List<LabOrderDTO> searchByOrderNumber(String orderNumber) {
        List<LabOrderV2> labOrders = labOrderRepository.findByOrderNumberContaining(orderNumber);
        return labOrders.stream().map(LabOrderDTO::new).collect(Collectors.toList());
    }

    @Override
    public List<LabOrderDTO> searchByReferringDoctor(String doctorName) {
        List<LabOrderV2> labOrders = labOrderRepository.findByReferringDoctorContaining(doctorName);
        return labOrders.stream().map(LabOrderDTO::new).collect(Collectors.toList());
    }

    @Override
    public List<LabOrderDTO> searchByBranchIdAndOrderNumber(Long branchId, String orderNumber) {
        List<LabOrderV2> labOrders = labOrderRepository.findByBranchIdAndOrderNumberContaining(branchId, orderNumber);
        return labOrders.stream().map(LabOrderDTO::new).collect(Collectors.toList());
    }

    @Override
    public List<LabOrderDTO> searchByBranchIdAndReferringDoctor(Long branchId, String doctorName) {
        List<LabOrderV2> labOrders = labOrderRepository.findByBranchIdAndReferringDoctorContaining(branchId, doctorName);
        return labOrders.stream().map(LabOrderDTO::new).collect(Collectors.toList());
    }

    @Override
    public Status generateOrderNumber(LabOrderDTO labOrderDTO) {
        try {
            String datePrefix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String orderNumber;
            int counter = 1;
            
            do {
                orderNumber = "LAB" + datePrefix + String.format("%04d", counter);
                counter++;
            } while (labOrderRepository.existsByOrderNumber(orderNumber));
            
            labOrderDTO.setOrderNumber(orderNumber);
            return new Status(true, "Order number generated: " + orderNumber);
        } catch (Exception e) {
            log.error("Error generating order number: ", e);
            return new Status(false, "Failed to generate order number");
        }
    }
}
