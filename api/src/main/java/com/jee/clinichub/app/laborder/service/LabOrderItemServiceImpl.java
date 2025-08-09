
package com.jee.clinichub.app.laborder.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jee.clinichub.app.laborder.model.LabOrderItem;
import com.jee.clinichub.app.laborder.model.LabOrderItemDTO;
import com.jee.clinichub.app.laborder.model.enums.LabOrderItemStatus;
import com.jee.clinichub.app.laborder.repository.LabOrderItemRepository;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class LabOrderItemServiceImpl implements LabOrderItemService {

    private final LabOrderItemRepository labOrderItemRepository;

    @Override
    public List<LabOrderItemDTO> getAllLabOrderItems() {
        List<LabOrderItem> items = labOrderItemRepository.findAll();
        return items.stream().map(LabOrderItemDTO::new).collect(Collectors.toList());
    }

    @Override
    public LabOrderItemDTO getLabOrderItemById(Long id) {
        Optional<LabOrderItem> item = labOrderItemRepository.findById(id);
        if (item.isPresent()) {
            return new LabOrderItemDTO(item.get());
        }
        throw new EntityNotFoundException("Lab Order Item not found with ID: " + id);
    }

    @Override
    public Status saveOrUpdate(LabOrderItemDTO labOrderItemDTO) {
        try {
            LabOrderItem item = labOrderItemDTO.getId() == null ? 
                new LabOrderItem(labOrderItemDTO) : updateExistingItem(labOrderItemDTO);
            
            labOrderItemRepository.save(item);
            return new Status(true, (labOrderItemDTO.getId() == null ? "Added" : "Updated") + " Successfully");
        } catch (Exception e) {
            log.error("Error saving lab order item: ", e);
            return new Status(false, "Failed to save lab order item: " + e.getMessage());
        }
    }

    private LabOrderItem updateExistingItem(LabOrderItemDTO dto) {
        LabOrderItem existing = labOrderItemRepository.findById(dto.getId())
            .orElseThrow(() -> new EntityNotFoundException("Lab Order Item not found with ID: " + dto.getId()));

        existing.setTestTypeId(dto.getTestTypeId());
        existing.setStatus(dto.getStatus());
        existing.setSampleCollected(dto.getSampleCollected());
        existing.setSampleCollectionDate(dto.getSampleCollectionDate());

        return existing;
    }

    @Override
    public Status deleteById(Long id) {
        try {
            Optional<LabOrderItem> item = labOrderItemRepository.findById(id);
            if (!item.isPresent()) {
                return new Status(false, "Lab Order Item not found with ID: " + id);
            }
            labOrderItemRepository.deleteById(id);
            return new Status(true, "Deleted Successfully");
        } catch (Exception e) {
            log.error("Error deleting lab order item: ", e);
            return new Status(false, "Failed to delete lab order item: " + e.getMessage());
        }
    }

    @Override
    public Status updateStatus(Long id, LabOrderItemStatus status) {
        try {
            Optional<LabOrderItem> item = labOrderItemRepository.findById(id);
            if (!item.isPresent()) {
                return new Status(false, "Lab Order Item not found with ID: " + id);
            }
            LabOrderItem existingItem = item.get();
            existingItem.setStatus(status);
            labOrderItemRepository.save(existingItem);
            return new Status(true, "Status updated successfully");
        } catch (Exception e) {
            log.error("Error updating lab order item status: ", e);
            return new Status(false, "Failed to update status: " + e.getMessage());
        }
    }

    @Override
    public List<LabOrderItemDTO> getLabOrderItemsByOrderId(Long labOrderId) {
        List<LabOrderItem> items = labOrderItemRepository.findAllByLabOrder_id(labOrderId);
        return items.stream().map(LabOrderItemDTO::new).collect(Collectors.toList());
    }

    @Override
    public List<LabOrderItemDTO> getLabOrderItemsByTestTypeId(Long testTypeId) {
        List<LabOrderItem> items = labOrderItemRepository.findAllByTestTypeId(testTypeId);
        return items.stream().map(LabOrderItemDTO::new).collect(Collectors.toList());
    }

    @Override
    public List<LabOrderItemDTO> getLabOrderItemsByStatus(LabOrderItemStatus status) {
        List<LabOrderItem> items = labOrderItemRepository.findAllByStatus(status);
        return items.stream().map(LabOrderItemDTO::new).collect(Collectors.toList());
    }

    @Override
    public Status updateSampleCollection(Long id, Boolean collected) {
        try {
            Optional<LabOrderItem> item = labOrderItemRepository.findById(id);
            if (!item.isPresent()) {
                return new Status(false, "Lab Order Item not found with ID: " + id);
            }
            LabOrderItem existingItem = item.get();
            existingItem.setSampleCollected(collected);
            if (collected) {
                existingItem.setSampleCollectionDate(LocalDateTime.now());
            } else {
                existingItem.setSampleCollectionDate(null);
            }
            labOrderItemRepository.save(existingItem);
            return new Status(true, "Sample collection status updated successfully");
        } catch (Exception e) {
            log.error("Error updating sample collection status: ", e);
            return new Status(false, "Failed to update sample collection status: " + e.getMessage());
        }
    }
}
