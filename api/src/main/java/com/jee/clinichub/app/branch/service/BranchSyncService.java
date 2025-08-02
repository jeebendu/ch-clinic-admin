
package com.jee.clinichub.app.branch.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicMaster;
import com.jee.clinichub.app.admin.clinic.allclinic.repository.ClinicMasterRepository;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.branch.model.BranchMaster;
import com.jee.clinichub.app.branch.repository.BranchMasterRepository;
import com.jee.clinichub.app.branch.repository.BranchRepository;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class BranchSyncService {

    private final BranchRepository branchRepository;
    private final BranchMasterRepository branchMasterRepository;
    private final ClinicMasterRepository clinicMasterRepository;

    @Value("${app.default-tenant}")
    private String defaultTenant;




    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void syncBranchToMaster(BranchDto branchDto, String sourceTenant) {
        String originalTenantContext = TenantContextHolder.getCurrentTenant();
        try {
            TenantContextHolder.setCurrentTenant(defaultTenant);

            Optional<BranchMaster> existingBranchMaster = branchMasterRepository
                    .findByGlobalBranchId(branchDto.getGlobalBranchId());

            BranchMaster branchMaster;
            if (existingBranchMaster.isPresent()) {
                branchMaster = existingBranchMaster.get();
                branchMaster.updateFromDto(branchDto, sourceTenant);
            } else {
                branchMaster = BranchMaster.fromDto(branchDto, sourceTenant);
                Optional<ClinicMaster> clinicMaster = clinicMasterRepository.findByTenant_clientId(sourceTenant);
                if (clinicMaster.isPresent()) {
                    branchMaster.setClinicMaster(clinicMaster.get());
                } else {
                    throw new Exception("Clinic not found");
                }
            }

            branchMasterRepository.save(branchMaster);
            log.info("Successfully synced branch to master schema. GlobalBranchId: {}", branchDto.getGlobalBranchId());

        } catch (Exception e) {
            log.error(
                    "Error syncing branch to master schema. Branch name: '{}', GlobalBranchId: {}, Source tenant: {}. Error: {}",
                    branchDto.getName(), branchDto.getGlobalBranchId(), sourceTenant, e.getMessage(), e);
            throw new RuntimeException(
                    "Failed to sync branch to master schema for GlobalBranchId: " + branchDto.getGlobalBranchId(), e);
        } finally {
            TenantContextHolder.setCurrentTenant(originalTenantContext);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteBranchFromMaster(UUID globalBranchId, String sourceTenant) {
        String originalTenantContext = TenantContextHolder.getCurrentTenant();
        try {

            Optional<BranchMaster> branchMasterOptional = branchMasterRepository.findByGlobalBranchId(globalBranchId);

            if (branchMasterOptional.isPresent()) {
                branchMasterRepository.delete(branchMasterOptional.get());
                log.info("Successfully deleted branch from master schema. GlobalBranchId: {}", globalBranchId);
            } else {
                log.warn("Branch not found in master schema for deletion (this might be expected). GlobalBranchId: {}",
                        globalBranchId);
            }

        } catch (Exception e) {
            log.error("Error deleting branch from master schema. GlobalBranchId: {}, Source tenant: {}. Error: {}",
                    globalBranchId, sourceTenant, e.getMessage(), e);
            throw new RuntimeException(
                    "Failed to delete branch from master schema for GlobalBranchId: " + globalBranchId, e);
        } finally {
            TenantContextHolder.setCurrentTenant(originalTenantContext);
        }
    }
}
