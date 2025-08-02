package com.jee.clinichub.app.doctor.availability.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.doctor.availability.entity.DoctorAvailability;
import com.jee.clinichub.app.doctor.availability.entity.DoctorAvailabilityDTO;
import com.jee.clinichub.app.doctor.availability.repository.DoctorAvailabilityRepo;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class DoctorAvailabilityServiceImpl implements DoctorAvailabilityService {

    @Autowired
    private DoctorAvailabilityRepo doctorAvailabilityRepository;

    @Override
    public Status deleteById(Long id) {
        doctorAvailabilityRepository.findById(id).ifPresentOrElse(
                branch -> {
                    doctorAvailabilityRepository.deleteById(id);
                },
                () -> {
                    throw new EntityNotFoundException("Availability not found with ID: " + id);
                });
        return new Status(true, "Deleted Successfully");
    }

    @Override
    public List<DoctorAvailabilityDTO> getAllAvailability() {
        return doctorAvailabilityRepository.findAll().stream().map(DoctorAvailabilityDTO::new).toList();
    }

    @Override
    public DoctorAvailability getAvailabilityById(Long id) {
        return doctorAvailabilityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Availability not found with ID: " + id));
    }

    @Override
    public Status saveOrUpdate(@Valid DoctorAvailabilityDTO availabilityDTO) {
        try {
            DoctorAvailability availability = availabilityDTO.getId() == null ? new DoctorAvailability(availabilityDTO)
                    : setAvailableAvailability(availabilityDTO);
            doctorAvailabilityRepository.save(availability);
            return new Status(true, availabilityDTO.getId() == null ? "Added Successfully" : "Updated Successfully");
        } catch (Exception e) {
            log.error("Error saving or updating availability: {}", e.getMessage(), e);
            return new Status(false, "An error occurred");
        }
    }

    private DoctorAvailability setAvailableAvailability(DoctorAvailabilityDTO doctorAvailabilityDTO) {

        return doctorAvailabilityRepository.findById(doctorAvailabilityDTO.getId())
                .map(existingAvailable -> {
                    existingAvailable.setId(doctorAvailabilityDTO.getId());
                    existingAvailable.setDayOfWeek(doctorAvailabilityDTO.getDayOfWeek());
                    existingAvailable.setEndTime(doctorAvailabilityDTO.getEndTime());
                    existingAvailable.setStartTime(doctorAvailabilityDTO.getStartTime());
                    return existingAvailable;

                }).orElseThrow(() -> new EntityNotFoundException(
                        "Availability not found with ID: " + doctorAvailabilityDTO.getId()));
    }
}


