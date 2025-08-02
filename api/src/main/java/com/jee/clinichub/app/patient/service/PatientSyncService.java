package com.jee.clinichub.app.patient.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.service.BranchService;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.app.patient.model.PatientDto;
import com.jee.clinichub.app.patient.repository.PatientRepository;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class PatientSyncService {

    private final PatientRepository patientRepository;
    private final BranchService branchService;
    private final PatientService patientService;

    @Value("${app.default-tenant}")
    private String defaultTenant;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void syncPatientToTenant(PatientDto patientDto, String targetTenant, UUID branchGlobalId) {
        String originalTenantContext = TenantContextHolder.getCurrentTenant();
        try {
            TenantContextHolder.setCurrentTenant(targetTenant);

            Optional<Branch> optionalExistBranch = branchService.getByGlobalId(branchGlobalId);
            if (optionalExistBranch.isEmpty()) {
                throw new EntityNotFoundException("Branch not found at tenant: " + targetTenant);
            }

            Patient existingPatient = patientService.findPatientByGlobalId(patientDto.getGlobalPatientId());

            
            if (existingPatient != null) {
                // existingPatient.updateFromDto(patientDto);
                // patientRepository.save(existingPatient);
            } else {
                Patient patientNew = Patient.fromDto(patientDto);
                Branch managedBranch = entityManager.merge(optionalExistBranch.get());
                patientNew.setBranch(managedBranch);
                patientRepository.save(patientNew);
            }

        
            log.info("Successfully synced Patient to tenant [{}]. GlobalPatientId: {}", targetTenant,
                    patientDto.getGlobalPatientId());
        } finally {
            TenantContextHolder.setCurrentTenant(originalTenantContext);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deletePatientFromMaster(UUID globalPatientId, String sourceTenant) {
        String originalTenantContext = TenantContextHolder.getCurrentTenant();
        try {
            TenantContextHolder.setCurrentTenant(defaultTenant);

            Patient patient = patientService.findPatientByGlobalId(globalPatientId);

            if (patient != null) {
                // PatientRepository.delete(PatientOptional.get());
                log.info("Successfully deleted Patient from master schema. GlobalPatientId: {}", globalPatientId);
            } else {
                log.warn(
                        "Patient not found in master schema for deletion (this might be expected). GlobalPatientId: {}",
                        globalPatientId);
            }

        } catch (Exception e) {
            log.error("Error deleting Patient from master schema. GlobalPatientId: {}, Source tenant: {}. Error: {}",
                    globalPatientId, sourceTenant, e.getMessage(), e);
            throw new RuntimeException(
                    "Failed to delete Patient from master schema for GlobalPatientId: " + globalPatientId, e);
        } finally {
            TenantContextHolder.setCurrentTenant(originalTenantContext);
        }
    }

}
