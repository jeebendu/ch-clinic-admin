package com.jee.clinichub.app.doctor.percentage.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.doctor.model.Doctor;
import com.jee.clinichub.app.doctor.percentage.model.Percentage;
import com.jee.clinichub.app.doctor.percentage.model.PercentageDTO;
import com.jee.clinichub.app.doctor.percentage.repository.PercentageRepo;
import com.jee.clinichub.app.enquiryService.model.EnquiryServiceType;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class PercentageServiceImpl implements PercentageService {

    @Autowired
    PercentageRepo percentageRepo;

    @Override
    public List<PercentageDTO> getAllPercentage() {
        return percentageRepo.findAll().stream().map(PercentageDTO::new).toList();
    }

    @Override
    public PercentageDTO getById(Long id) {
        return percentageRepo.findById(id).map(PercentageDTO::new)
                .orElseThrow(() -> new EntityNotFoundException("percentage not found with ID: " + id));
    }

    @Override
    public Status deleteById(Long id) {
        percentageRepo.findById(id).ifPresentOrElse(percent -> {
            percentageRepo.deleteById(id);
        }, () -> {
            throw new EntityNotFoundException("percentage not found with ID: " + id);
        });
        return new Status(true, "Deleted Successfully");
    }

    @Override
    public Status saveOrUpdate(PercentageDTO percentageDTO) {
        try {
            boolean isExists = percentageRepo.existsByEnquiryServiceType_idAndDoctor_idAndIdNot(
                    percentageDTO.getEnquiryServiceType().getId(), percentageDTO.getDoctor().getId(),
                    percentageDTO.getId() != null ? percentageDTO.getId() : -1);

            if (isExists) {
                return new Status(false, "percentage already exists");
            }
            Percentage percentage = percentageDTO.getId() == null ? new Percentage(percentageDTO)
                    : this.setPercentage(percentageDTO);
            percentage.setDoctor(new Doctor(percentageDTO.getDoctor()));

            percentageRepo.save(percentage);
            return new Status(true, percentageDTO.getId() == null ? "Added Successfully" : "Updated Successfully");
        }

        catch (Exception e) {
            log.error("Error saving or updating percentage: {}", e.getMessage(), e);
            return new Status(false, "An error occurred");
        }
    }

    public Percentage setPercentage(PercentageDTO percentageDTO) {
        return percentageRepo.findById(percentageDTO.getId())
                .map(existingState -> {
                    existingState.setPercentage(percentageDTO.getPercentage());
                    existingState.setEnquiryServiceType(new EnquiryServiceType(percentageDTO.getEnquiryServiceType()));
                    // existingState.setDoctor(new Doctor(percentageDTO.getDoctor()));
                    return existingState;
                }).orElseThrow(
                        () -> new EntityNotFoundException("percentage not found with ID: " + percentageDTO.getId()));
    }

    @Override
    public List<PercentageDTO> getPercentageByDoctorId(Long id) {

        List<Percentage> percentageList = percentageRepo.findAllByDoctor_id(id);
        return percentageList.stream().map(PercentageDTO::new).collect(Collectors.toList());
        // return percentageDTOList;
    }

    @Override
    public List<PercentageDTO> findByIdAndEnquiryServiceTypeName(Long id, String name) {

        List<Percentage> percentLIst = percentageRepo.findAllByDoctor_IdAndEnquiryServiceType_NameContainingIgnoreCase(id, name);
        return percentLIst.stream().map(PercentageDTO::new).collect(Collectors.toList());
    }

}
