package com.jee.clinichub.app.doctor.doctorServiceMap.service;

import java.util.ArrayList;
import java.util.List;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.doctor.doctorServiceMap.model.DoctorServiceMap;
import com.jee.clinichub.app.doctor.doctorServiceMap.model.DoctorServiceMapDto;
import com.jee.clinichub.app.doctor.doctorServiceMap.repository.DoctorServiceMapRepo;
import com.jee.clinichub.app.doctor.model.DoctorBranch;
import com.jee.clinichub.app.enquiryService.model.EnquiryServiceType;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class DoctorServiceMapServiceImpl implements DoctorServiceMapService {

    @Autowired
    private DoctorServiceMapRepo doctorServiceMapRepository;

    @Override
    public Status saveOrUpdate(DoctorServiceMapDto dto) {
        try {
            DoctorServiceMap entity = dto.getId() == null
                    ? new DoctorServiceMap(dto)
                    : updateEntity(dto);

            doctorServiceMapRepository.save(entity);

            String message = (dto.getId() == null) ? "Added Successfully" : "Updated Successfully";
            return new Status(true, message);
        } catch (Exception e) {
            log.error("Error saving/updating DoctorServiceMap: {}", e.getMessage(), e);
            return new Status(false, "An error occurred");
        }
    }

    private DoctorServiceMap updateEntity(DoctorServiceMapDto dto) {
        return doctorServiceMapRepository.findById(dto.getId())
                .map(existing -> {
                    existing.setDoctorBranch(new DoctorBranch(dto.getDoctorBranch()));
                    existing.setServiceType(new EnquiryServiceType(dto.getServiceType()));
                    existing.setPrice(dto.getPrice());
                    return existing;
                })
                .orElseThrow(() -> new EntityNotFoundException("DoctorServiceMap not found with ID: " + dto.getId()));
    }

    @Override
    public List<DoctorServiceMapDto> getAllDoctorServiceMap() {
        return doctorServiceMapRepository.findAll().stream()
                .map(DoctorServiceMapDto::new)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "doctorCache", keyGenerator = "multiTenantCacheKeyGenerator")
    public DoctorServiceMapDto getById(Long id) {
        return doctorServiceMapRepository.findById(id)
                .map(DoctorServiceMapDto::new)
                .orElseThrow(() -> new EntityNotFoundException("DoctorServiceMap not found with ID: " + id));
    }

    @Override
    public Status deleteById(Long id) {
        doctorServiceMapRepository.findById(id).ifPresentOrElse(
                existing -> doctorServiceMapRepository.deleteById(id),
                () -> {
                    throw new EntityNotFoundException("DoctorServiceMap not found with ID: " + id);
                });
        return new Status(true, "Deleted Successfully");
    }

    @Override
    public List<DoctorServiceMapDto> getByDoctorBranchId(Long id) {
        return doctorServiceMapRepository.findAllByDoctorBranch_id(id).stream()
                .map(DoctorServiceMapDto::new)
                .toList();
    }

    @Override
    public List<DoctorServiceMapDto> getAllByBranchAndDoctor(Long doctorId, Long branchId) {
        return doctorServiceMapRepository.findAllByDoctorBranch_doctor_idAndDoctorBranch_branch_id(doctorId, branchId)
                .stream()
                .map(DoctorServiceMapDto::new)
                .toList();
    }

    @Override
    public List<DoctorServiceMapDto> getListByDoctorId(Long id) {
        List<DoctorServiceMapDto> result = new ArrayList<DoctorServiceMapDto>();
        try {
            result = doctorServiceMapRepository.findUniqueByDoctorId(id).stream()
                    .map(DoctorServiceMapDto::new)
                    .toList();
        } catch (Exception e) {
            log.error("Something went wrong");
        }
        return result;
    }

}
