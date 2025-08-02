package com.jee.clinichub.app.admin.clinic.clinicFacility.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.jee.clinichub.app.admin.clinic.clinicFacility.model.ClinicFacility;
import com.jee.clinichub.app.admin.clinic.clinicFacility.model.ClinicFacilityDto;
import com.jee.clinichub.app.admin.clinic.clinicFacility.repository.ClinicFacilityRepo;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class ClinicFacilityServiceImpl implements ClinicFacilityService {

    private final ClinicFacilityRepo clinicFacilityRepo;

    @Override
    public List<ClinicFacilityDto> getAllFacility() {
        return clinicFacilityRepo.findAll().stream().map(ClinicFacilityDto::new).toList();
    }

    @Override
    public ClinicFacilityDto getById(Long id) {
        try {
            return clinicFacilityRepo.findById(id).map(ClinicFacilityDto::new).orElseThrow(() -> {
                throw new EntityNotFoundException("Clinic Type not found wit id: " + id);
            });
        } catch (Exception e) {
            log.error("Error fetching ClinicFacility by ID: " + id, e);
            return null;
        }
    }

    @Override
    public Status saveOrUpdate(@Valid ClinicFacilityDto clinicFacilityDto) {
        try {
            ClinicFacility clinicFacility = clinicFacilityDto.getId() == null ? new ClinicFacility(clinicFacilityDto)
                    : setClinicFacility(clinicFacilityDto);

            clinicFacilityRepo.save(clinicFacility);
            return new Status(true, (clinicFacilityDto.getId() == null ? "Added" : "Updated") + " Successfully");
        } catch (Exception e) {
            return new Status(false, "Something went wrong");
        }

    }

    private ClinicFacility setClinicFacility(@Valid ClinicFacilityDto clinicFacilityDto) {
        try {
            Optional<ClinicFacility> existing = clinicFacilityRepo.findById(clinicFacilityDto.getId());
            if (existing.isPresent()) {
                ClinicFacility exClinicFacility = existing.get();
                exClinicFacility.setName(clinicFacilityDto.getName());

                return exClinicFacility;
            } else {
                log.warn("ClinicFacility not found for update, ID: " + clinicFacilityDto.getId());
            }
        } catch (Exception e) {
            log.error("Error updating ClinicFacility fields: " + e.getLocalizedMessage(), e);
        }
        return new ClinicFacility();
    }

    @Override
    public Status deleteById(Long id) {
        try {
            Optional<ClinicFacility> clinicFacility = clinicFacilityRepo.findById(id);
            if (clinicFacility.isEmpty()) {
                return new Status(false, "Clinic Type not found");
            }
            clinicFacilityRepo.deleteById(id);
            return new Status(true, "Deleted Successfully");
        } catch (Exception e) {
            log.error("Error deleting ClinicFacility: " + e.getLocalizedMessage(), e);
        }

        return new Status(false, "Something went wrong");
    }
}
                                             