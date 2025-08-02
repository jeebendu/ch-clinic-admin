package com.jee.clinichub.app.core.status.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.core.status.model.StatusDTO;
import com.jee.clinichub.app.core.status.model.StatusModel;
import com.jee.clinichub.app.core.status.repository.StatusRepo;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

@Service
public class StatusServiceImpl implements StatusService {

    @Autowired
    StatusRepo statusRepo;

    @Override
    public Status deleteById(Long id) {
        statusRepo.findById(id).ifPresentOrElse(source -> {
            statusRepo.deleteById(id);
        }, () -> {
            throw new EntityNotFoundException("Status not found with ID: " + id);
        });
        return new Status(true, "Status deleted Successfully");
    }

    @Override
    public List<StatusDTO> getAllBranches() {
        return statusRepo.findAll().stream().map(StatusDTO::new).toList();
    }

    @Override
    public StatusDTO getById(Long id) {
        return statusRepo.findById(id).map(StatusDTO::new)
                .orElseThrow(() -> new EntityNotFoundException("Status not found with id" + id));
    }

    @Override
    public Status saveOrUpdate(@Valid StatusDTO statusDTO) {
        try {

            boolean nameExists = statusRepo.existsByName(statusDTO.getName());

            if (nameExists) {
                return new Status(false, "Status name already exist");
            }
            StatusModel statusModel = statusDTO.getId() == null ? new StatusModel(statusDTO)
                    : setNewStatusModel(statusDTO);
            statusRepo.save(statusModel);
            return new Status(true, statusDTO.getId() == null ? "Added Successfully" : "Updated Successfully");
        } catch (Exception e) {
            return new Status(false, "An error occurred");
        }
    }

    public StatusModel setNewStatusModel(StatusDTO statusDTO) {
        return statusRepo.findById(statusDTO.getId())
                .map(existingStatus -> {
                    existingStatus.setName(statusDTO.getName());
                    existingStatus.setColor(statusDTO.getColor());
                    return existingStatus;
                }).orElseThrow(() -> new EntityNotFoundException("Status not found with ID: " + statusDTO.getId()));
    }

    
}