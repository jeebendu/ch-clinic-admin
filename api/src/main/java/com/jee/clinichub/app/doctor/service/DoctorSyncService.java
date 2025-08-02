
package com.jee.clinichub.app.doctor.service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.service.BranchService;
import com.jee.clinichub.app.doctor.model.Doctor;
import com.jee.clinichub.app.doctor.model.DoctorBranch;
import com.jee.clinichub.app.doctor.model.DoctorDto;
import com.jee.clinichub.app.doctor.repository.DoctorRepository;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class DoctorSyncService {

    private final DoctorRepository doctorRepository;
    private final BranchService branchService;

    private DoctorService doctorService;

    @Autowired
    public void setDoctorService(@Lazy DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @Value("${app.default-tenant}")
    private String defaultTenant;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void syncDoctorToMaster(DoctorDto doctorDto, String sourceTenant,
            UUID doctorBrancgGlobalId) {
        String originalTenantContext = TenantContextHolder.getCurrentTenant();
        try {
            TenantContextHolder.setCurrentTenant(defaultTenant);

            Optional<Doctor> existingDoctor = doctorRepository.findByGlobalDoctorId(doctorDto.getGlobalDoctorId());

            Doctor doctor;

            if (existingDoctor.isPresent()) {
                doctor = existingDoctor.get();
                doctor.updateFromDto(doctorDto);

                Set<DoctorBranch> listOfdrbranch = new HashSet<>();

                doctorDto.getBranchList().forEach(obj -> {

                    Optional<DoctorBranch> drbranch = doctorService
                            .findDoctorBranchByGlobalId(obj.getGlobalDoctorBranchId());

                    if (drbranch.isPresent()) {
                        listOfdrbranch.add(drbranch.get());
                    } else {
                        Branch currentBranch = branchService.getByGlobalId(obj.getBranch().getGlobalBranchId())
                                .orElseThrow(() -> new EntityNotFoundException("Branch not found"));
                        currentBranch.setClinic(null);

                        DoctorBranch doctorBranch = new DoctorBranch();
                        doctorBranch.setDoctor(doctor);
                        doctorBranch.setBranch(currentBranch);
                        doctorBranch.setConsultationFee(obj.getConsultationFee());
                        doctorBranch.setGlobalDoctorBranchId(obj.getGlobalDoctorBranchId());
                        listOfdrbranch.add(doctorBranch);
                    }
                });
                doctor.setBranchList(listOfdrbranch);
            } else {
                doctor = Doctor.fromDto(doctorDto);
                Set<DoctorBranch> listOfdrbranch = new HashSet<>();

                doctorDto.getBranchList().forEach(obj -> {

                    Branch currentBranch = branchService.getByGlobalId(obj.getBranch().getGlobalBranchId())
                            .orElseThrow(() -> new EntityNotFoundException("Branch not found"));
                    currentBranch.setClinic(null);

                    DoctorBranch doctorBranch = new DoctorBranch();
                    doctorBranch.setDoctor(doctor);
                    doctorBranch.setBranch(currentBranch);
                    doctorBranch.setConsultationFee(obj.getConsultationFee());
                    doctorBranch.setGlobalDoctorBranchId(obj.getGlobalDoctorBranchId());
                    listOfdrbranch.add(doctorBranch);
                });
                doctor.setBranchList(listOfdrbranch);
            }

            doctorRepository.save(doctor);
            log.info("Successfully synced doctor to master schema. GlobalDoctorId: {}", doctorDto.getGlobalDoctorId());

        } catch (Exception e) {
            log.error(
                    "Error syncing doctor to master schema. Doctor name: '{}', GlobalDoctorId: {}, Source tenant: {}. Error: {}",
                    doctorDto.getFirstname() + " " + doctorDto.getLastname(), doctorDto.getGlobalDoctorId(),
                    sourceTenant, e.getMessage(), e);
            throw new RuntimeException(
                    "Failed to sync doctor to master schema for GlobalDoctorId: " + doctorDto.getGlobalDoctorId(), e);
        } finally {
            TenantContextHolder.setCurrentTenant(originalTenantContext);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteDoctorFromMaster(UUID globalDoctorId, String sourceTenant) {
        String originalTenantContext = TenantContextHolder.getCurrentTenant();
        try {
            TenantContextHolder.setCurrentTenant(defaultTenant);

            Optional<Doctor> doctorOptional = doctorRepository.findByGlobalDoctorId(globalDoctorId);

            if (doctorOptional.isPresent()) {
                // doctorOptional.get().setPublishedOnline(false);
                // doctorRepository.save(doctorOptional.get());
                log.info("Successfully deleted doctor from master schema. GlobalDoctorId: {}", globalDoctorId);
            } else {
                log.warn("Doctor not found in master schema for deletion (this might be expected). GlobalDoctorId: {}",
                        globalDoctorId);
            }

        } catch (Exception e) {
            log.error("Error deleting doctor from master schema. GlobalDoctorId: {}, Source tenant: {}. Error: {}",
                    globalDoctorId, sourceTenant, e.getMessage(), e);
            throw new RuntimeException(
                    "Failed to delete doctor from master schema for GlobalDoctorId: " + globalDoctorId, e);
        } finally {
            TenantContextHolder.setCurrentTenant(originalTenantContext);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void syncDoctorToTenant(DoctorDto doctorDto, String targetTenant, DoctorBranch drBranch) {
        String originalTenantContext = TenantContextHolder.getCurrentTenant();
        try {
            TenantContextHolder.setCurrentTenant(targetTenant);

            Optional<Doctor> existingDoctor = doctorService.findDoctoryGlobalId(doctorDto.getGlobalDoctorId());

            Doctor doctor;
            if (existingDoctor.isPresent()) {
                doctor = existingDoctor.get();
                doctor.updateFromDto(doctorDto);

                DoctorBranch doctorBranch = new DoctorBranch();
                doctorBranch.setDoctor(doctor);
                Optional<Branch> currBranch = branchService.getByGlobalId(drBranch.getBranch().getGlobalBranchId());
                Set<DoctorBranch> listOfdrbranch = new HashSet<>();
                if (doctor.getBranchList() != null && doctor.getBranchList().size() > 0) {
                    listOfdrbranch.addAll(doctor.getBranchList());
                }
                if (currBranch.isPresent()) {
                    doctorBranch.setBranch(currBranch.get());
                    listOfdrbranch.add(doctorBranch);
                }
                doctor.setBranchList(listOfdrbranch);

            } else {
                doctor = Doctor.fromDto(doctorDto);

                DoctorBranch doctorBranch = new DoctorBranch();
                doctorBranch.setDoctor(doctor);
                Optional<Branch> currBranch = branchService.getByGlobalId(drBranch.getBranch().getGlobalBranchId());
                Set<DoctorBranch> listOfdrbranch = new HashSet<>();
                if (doctor.getBranchList() != null && doctor.getBranchList().size() > 0) {
                    listOfdrbranch.addAll(doctor.getBranchList());
                }
                if (currBranch.isPresent()) {
                    doctorBranch.setBranch(currBranch.get());
                    listOfdrbranch.add(doctorBranch);
                }
                doctor.setBranchList(listOfdrbranch);
            }

            doctorService.saveDoctor(doctor);
            log.info("Successfully synced doctor to tenant '{}'. GlobalDoctorId: {}", targetTenant,
                    doctorDto.getGlobalDoctorId());

        } catch (Exception e) {
            log.error(
                    "Error syncing doctor to tenant '{}'. Doctor name: '{}', GlobalDoctorId: {}, Error: {}",
                    targetTenant, doctorDto.getFirstname() + " " + doctorDto.getLastname(),
                    doctorDto.getGlobalDoctorId(), e.getMessage(), e);
            throw new RuntimeException(
                    "Failed to sync doctor to tenant '" + targetTenant + "' for GlobalDoctorId: "
                            + doctorDto.getGlobalDoctorId(),
                    e);
        } finally {
            TenantContextHolder.setCurrentTenant(originalTenantContext);
        }
    }

    // ********************************************

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void syncDoctorUpdateToMaster(DoctorDto doctorDto, String sourceTenant) {
        String originalTenantContext = TenantContextHolder.getCurrentTenant();
        try {
            TenantContextHolder.setCurrentTenant(defaultTenant);

            Optional<Doctor> existingDoctor = doctorRepository.findByGlobalDoctorId(doctorDto.getGlobalDoctorId());

            if (!existingDoctor.isPresent()) {
                return;
            }

            Doctor doctor;

            doctor = existingDoctor.get();
            doctor.updateFromDto(doctorDto);

            Set<DoctorBranch> listOfdrbranch = new HashSet<>();

            doctorDto.getBranchList().forEach(obj -> {

                Optional<DoctorBranch> drbranch = doctorService
                        .findDoctorBranchByGlobalId(obj.getGlobalDoctorBranchId());

                if (drbranch.isPresent()) {
                    listOfdrbranch.add(drbranch.get());
                } else {
                    Branch currentBranch = branchService.getByGlobalId(obj.getBranch().getGlobalBranchId())
                            .orElseThrow(() -> new EntityNotFoundException("Branch not found"));
                    currentBranch.setClinic(null);

                    DoctorBranch doctorBranch = new DoctorBranch();
                    doctorBranch.setDoctor(doctor);
                    doctorBranch.setBranch(currentBranch);
                     doctorBranch.setConsultationFee(obj.getConsultationFee());
                    doctorBranch.setGlobalDoctorBranchId(obj.getGlobalDoctorBranchId());
                    listOfdrbranch.add(doctorBranch);
                }
            });
            doctor.setBranchList(listOfdrbranch);

            doctorRepository.save(doctor);
            log.info("Successfully synced doctor to master schema. GlobalDoctorId: {}", doctorDto.getGlobalDoctorId());

        } catch (Exception e) {
            log.error(
                    "Error syncing doctor to master schema. Doctor name: '{}', GlobalDoctorId: {}, Source tenant: {}. Error: {}",
                    doctorDto.getFirstname() + " " + doctorDto.getLastname(), doctorDto.getGlobalDoctorId(),
                    sourceTenant, e.getMessage(), e);
            throw new RuntimeException(
                    "Failed to sync doctor to master schema for GlobalDoctorId: " + doctorDto.getGlobalDoctorId(), e);
        } finally {
            TenantContextHolder.setCurrentTenant(originalTenantContext);
        }
    }
}
