package com.jee.clinichub.app.core.source.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.core.source.model.Source;
import com.jee.clinichub.app.core.source.model.SourceDTO;
import com.jee.clinichub.app.core.source.repository.SourceRepo;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;


@Service
public class SourceServiceImpl implements SourceService {

    @Autowired
    SourceRepo sourceRepo;

    @Override
    public Status deleteById(Long id) {
        sourceRepo.findById(id).ifPresentOrElse(source -> {
            sourceRepo.deleteById(id);
        }, () -> {
            throw new EntityNotFoundException("Source not found with ID: " + id);
        });
        return new Status(true, "Source deleted Successfully");
    }

    @Override
    public List<SourceDTO> getAllBranches() {
        return sourceRepo.findAll().stream().map(SourceDTO::new).toList();
    }

    @Override
    public SourceDTO getById(Long id) {
        return sourceRepo.findById(id).map(SourceDTO::new)
                .orElseThrow(() -> new EntityNotFoundException("Source not found with id" + id));
    }

    @Override
    public Status saveOrUpdate(@Valid SourceDTO sourceDTO) {
        try {
            // boolean isName = sourceRepo.findByNameIgnoreCaseAndIdNot(sourceDTO.getName(),
            //         sourceDTO.getId() != null ? sourceDTO.getId() : -1);

                    boolean nameExists = sourceRepo.existsByNameIgnoreCase(sourceDTO.getName());

            if (nameExists) {
                return new Status(false, "Source name already exist");
            }
            Source source = sourceDTO.getId() == null ? new Source(sourceDTO) : setNewSource(sourceDTO);
            sourceRepo.save(source);
            return new Status(true, sourceDTO.getId() == null ? "Added Successfully" : "Updated Successfully");
        } catch (Exception e) {
            return new Status(false, "An error occurred");
        }
    }


    public Source setNewSource(SourceDTO sourceDTO) {
        return sourceRepo.findById(sourceDTO.getId())
                .map(existingSource -> {
                    existingSource.setName(sourceDTO.getName());
                    return existingSource;
                }).orElseThrow(() -> new EntityNotFoundException("Source not found with ID: " + sourceDTO.getId()));
    }

    
}