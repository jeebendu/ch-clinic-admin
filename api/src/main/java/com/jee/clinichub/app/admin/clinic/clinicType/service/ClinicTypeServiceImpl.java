package com.jee.clinichub.app.admin.clinic.clinicType.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicDto;
import com.jee.clinichub.app.admin.clinic.clinicType.model.ClinicType;
import com.jee.clinichub.app.admin.clinic.clinicType.model.ClinicTypeDto;
import com.jee.clinichub.app.admin.clinic.clinicType.repository.ClinicTypeRepo;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service(value = "Clinic-Type")
@RequiredArgsConstructor
public class ClinicTypeServiceImpl implements ClinicTypeService {

    private final ClinicTypeRepo clinicTypeRepo;

    @Override
    public List<ClinicTypeDto> getAllClinicType() {
        List<ClinicType> clinicTypes = clinicTypeRepo.findAll();
        return clinicTypes.stream().map(ClinicTypeDto::new).toList();
    }

    @Override
    public ClinicTypeDto getById(Long id) {
        try {
            return clinicTypeRepo.findById(id).map(ClinicTypeDto::new).orElseThrow(() -> {
                throw new EntityNotFoundException("Clinic Type not found wit id: " + id);
            });
        } catch (Exception e) {
            log.error("Error fetching ClinicType by ID: " + id, e);
            return null;
        }
    }

    @Override
    public Status saveOrUpdate(@Valid ClinicTypeDto clinicTypeDto) {
        try {
            ClinicType clinicType = clinicTypeDto.getId() == null ? new ClinicType(clinicTypeDto)
                    : setClinicType(clinicTypeDto);

            clinicTypeRepo.save(clinicType);
            return new Status(true, (clinicTypeDto.getId() == null ? "Added" : "Updated") + " Successfully");
        } catch (Exception e) {
            return new Status(false, "Something went wrong");
        }

    }

    private ClinicType setClinicType(@Valid ClinicTypeDto clinicTypeDto) {
        try {
            Optional<ClinicType> existing = clinicTypeRepo.findById(clinicTypeDto.getId());
            if (existing.isPresent()) {
                ClinicType exClinicType = existing.get();
                exClinicType.setName(clinicTypeDto.getName());
                exClinicType.setDescription(clinicTypeDto.getDescription());
                return exClinicType;
            } else {
                log.warn("ClinicType not found for update, ID: " + clinicTypeDto.getId());
            }
        } catch (Exception e) {
            log.error("Error updating ClinicType fields: " + e.getLocalizedMessage(), e);
        }
        return new ClinicType();
    }

    @Override
    public Status deleteById(Long id) {
        try {
            Optional<ClinicType> clinicType = clinicTypeRepo.findById(id);
            if (!clinicType.isPresent()) {
                return new Status(false, "Clinic Type not found");
            }
            clinicTypeRepo.deleteById(id);
            return new Status(true, "Deleted Successfully");
        } catch (Exception e) {
            log.error("Error deleting ClinicType: " + e.getLocalizedMessage(), e);
        }

        return new Status(false, "Something went wrong");
    }

    @Override
    public List<ClinicTypeDto> filterType(ClinicTypeDto search) {
        try {
            log.info("Inside service - search: {}", search);
            String name = (search != null && search.getName() != null) ? search.getName() : "";
            log.info("Searching for clinic types with name filter: '{}'", name);

            List<ClinicType> results = clinicTypeRepo.filterType(name);
            log.info("Fetched {} clinic types from DB", results.size());

            List<ClinicTypeDto> dtoList = results.stream().map(ClinicTypeDto::new).toList();
            log.info("Mapped to DTOs, returning {} items", dtoList.size());
            return dtoList;
        } catch (Exception e) {
            log.error("Exception in filterType service method", e);
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

}
