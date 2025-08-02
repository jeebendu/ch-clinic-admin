
package com.jee.clinichub.app.branch.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.history.Revision;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.jee.clinichub.app.admin.clinic.allclinic.model.Clinic;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicDto;
import com.jee.clinichub.app.admin.clinic.allclinic.repository.ClinicRepository;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.branch.model.BranchMaster;
import com.jee.clinichub.app.branch.model.BranchSearch;
import com.jee.clinichub.app.branch.repository.BranchMasterRepository;
import com.jee.clinichub.app.branch.repository.BranchRepository;
import com.jee.clinichub.app.core.district.model.District;
import com.jee.clinichub.app.core.sequence.model.Sequence;
import com.jee.clinichub.app.core.sequence.repository.SequenceRepository;
import com.jee.clinichub.app.core.sequence.service.SequenceService;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service(value = "branchService")
@RequiredArgsConstructor
public class BranchServiceImpl implements BranchService {

    private final BranchMasterRepository branchMasterRepository;

    private final BranchRepository branchRepository;
    private final ClinicRepository clinicRepository;
    private final BranchSyncService branchSyncService;
    private final BranchValidationService branchValidationService;
    private final SequenceService sequenceService;
    private final SequenceRepository sequenceRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Value("${app.default-tenant}")
    public String defaultTenant;



    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @CacheEvict(value = { "branchCache",
            "allBranchesCache" }, allEntries = true, keyGenerator = "multiTenantCacheKeyGenerator")
    public Status saveOrUpdate(BranchDto branchDto) {
        String operationTenant = TenantContextHolder.getCurrentTenant();
        boolean isNewBranch = branchDto.getId() == null;
        String originalTenantContext = TenantContextHolder.getCurrentTenant();

        try {
            TenantContextHolder.setCurrentTenant(operationTenant);

            Status validationResult = branchValidationService.validateBranchForSave(branchDto);
            if (!validationResult.isStatus()) {
                return validationResult;
            }

            Branch branch = isNewBranch ? createNewBranch(branchDto, operationTenant)
                    : updateExistingBranch(branchDto, operationTenant);

            if (branch.getClinic() != null) {
                Optional<Clinic> clinicEntity = clinicRepository.findById(branch.getClinic().getId());
                if (clinicEntity.isPresent()) {
                    branch.setClinic(clinicEntity.get());
                }
            } else {
                List<Clinic> existClinics = clinicRepository.findAll();
                branch.setClinic(existClinics.get(0));
            }

            branch = branchRepository.save(branch);

            if (isNewBranch) {
                sequenceService.createDefaultSequencesForBranch(branch);
            }

            if (operationTenant != null)
                syncBranchToMasterIfNeeded(branch, operationTenant);

            String message = isNewBranch ? "Added Successfully" : "Updated Successfully";
            return new Status(true, message);

        } catch (Exception e) {
            log.error("Error during branch save/update for tenant {}. BranchId: {}, Error: {}",
                    operationTenant, branchDto.getId(), e.getMessage(), e);
            return new Status(false, "An error occurred: " + e.getMessage());
        } finally {
            TenantContextHolder.setCurrentTenant(originalTenantContext);
        }
    }

    private Branch createNewBranch(BranchDto branchDto, String tenant) {
        log.info("Creating new branch '{}' in tenant: {}", branchDto.getName(), tenant);
        return Branch.fromDto(branchDto);
    }

    private Branch updateExistingBranch(BranchDto branchDto, String tenant) {
        if (branchDto.getId() == null) {
            throw new IllegalArgumentException("Branch ID cannot be null for an update.");
        }

        Optional<Branch> branchOptional = branchRepository.findOneById(branchDto.getId());
        Branch branch = branchOptional.orElseThrow(() -> {
            log.error("Branch not found with ID: {} in tenant: {} during update attempt.", branchDto.getId(), tenant);
            return new EntityNotFoundException(
                    "Branch not found with ID: " + branchDto.getId() + " in tenant " + tenant);
        });

        branch.updateFromDto(branchDto);
        return branch;
    }

    private void syncBranchToMasterIfNeeded(Branch branch, String sourceTenant) {
        if (!sourceTenant.equals(defaultTenant)) {
            BranchDto dtoForSync = BranchDto.fromBranch(branch);
            TenantContextHolder.setCurrentTenant(defaultTenant);
            branchSyncService.syncBranchToMaster(dtoForSync, sourceTenant);
        }
    }

    @Override
    public List<BranchMaster> getBranchMasterByClinicId(Long id) {
        return branchMasterRepository.findAllByClinicMaster_id(id);
    }

    @Override
    public List<BranchDto> getAllBranches() {
        String tenant = TenantContextHolder.getCurrentTenant();

        List<BranchDto> branchDtos;
        if (defaultTenant.equalsIgnoreCase(tenant)) {
            branchDtos = branchMasterRepository.findAll().stream()
                    .map(BranchDto::fromBranchMaster)
                    .toList();
        } else {
            branchDtos = branchRepository.findAll().stream()
                    .map(BranchDto::fromBranch)
                    .toList();
        }

        return branchDtos;
    }

    @Override
    public Page<BranchDto> getAllBranchesPaginated(Pageable pageable) {
        return branchRepository.findAll(pageable)
                .map(BranchDto::fromBranch);
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Branch findByName(String name) {
        return branchRepository.findBranchByName(name)
                .orElseThrow(() -> new EntityNotFoundException("Branch not found with name: " + name));
    }

    @Override
    @Transactional(propagation = Propagation.SUPPORTS)
    @Cacheable(value = "branchCache", keyGenerator = "multiTenantCacheKeyGenerator")
    public BranchDto getById(Long id) {
        String currentTenant = TenantContextHolder.getCurrentTenant();
        return branchRepository.findOneById(id)
                .map(BranchDto::fromBranch)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Branch not found with ID: " + id + " in tenant " + currentTenant));
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Cacheable(value = "branchCache", keyGenerator = "multiTenantCacheKeyGenerator")
    public Branch getBranchById(Long id) {
        String currentTenant = TenantContextHolder.getCurrentTenant();
        return branchRepository.findOneById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Branch (entity) not found with ID: " + id + " in tenant " + currentTenant));
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @CacheEvict(value = { "branchCache",
            "allBranchesCache" }, allEntries = true, keyGenerator = "multiTenantCacheKeyGenerator")
    public Status deleteById(Long id) {
        String operationTenant = TenantContextHolder.getCurrentTenant();
        String originalTenantContext = TenantContextHolder.getCurrentTenant();

        try {
            TenantContextHolder.setCurrentTenant(operationTenant);

            Branch branch = branchRepository.findOneById(id)
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Branch not found with ID: " + id + " in tenant " + operationTenant));

            deleteSequencesForBranch(branch.getId(), operationTenant);
            branchRepository.deleteById(id);
            syncBranchDeletionToMasterIfNeeded(branch.getGlobalBranchId(), operationTenant);

            return new Status(true, "Deleted Successfully");

        } catch (EntityNotFoundException e) {
            log.error("Branch not found for deletion in tenant {}: {}", operationTenant, e.getMessage());
            return new Status(false, e.getMessage());
        } catch (Exception e) {
            log.error("Error deleting branch with ID: {} in tenant {}: {}", id, operationTenant, e.getMessage(), e);
            return new Status(false, "An error occurred while deleting: " + e.getMessage());
        } finally {
            TenantContextHolder.setCurrentTenant(originalTenantContext);
        }
    }

    private void deleteSequencesForBranch(Long branchId, String tenantContext) {
        String originalTenantForSequenceDeletion = TenantContextHolder.getCurrentTenant();
        try {
            TenantContextHolder.setCurrentTenant(tenantContext);
            log.info("Switched tenant context to {} for deleting sequences for branch ID: {}", tenantContext, branchId);

            List<Sequence> sequences = sequenceRepository.findAllByBranch_id(branchId);
            if (!sequences.isEmpty()) {
                sequenceRepository.deleteAllInBatch(sequences);
                log.info("Deleted {} sequences for branch ID: {} in tenant: {}", sequences.size(), branchId,
                        tenantContext);
            }
        } catch (Exception e) {
            log.error("Error deleting sequences for branch ID: {} in tenant: {} - {}", branchId, tenantContext,
                    e.getMessage(), e);
        } finally {
            TenantContextHolder.setCurrentTenant(originalTenantForSequenceDeletion);
        }
    }

    private void syncBranchDeletionToMasterIfNeeded(UUID globalBranchId, String sourceTenant) {
        if (!sourceTenant.equals(defaultTenant)) {
            TenantContextHolder.setCurrentTenant(defaultTenant);
            branchSyncService.deleteBranchFromMaster(globalBranchId, sourceTenant);
        }
    }

    @Override
    public boolean existsByName(String name) {
        return branchRepository.existsByName(name);
    }

    @Override
    public List<BranchDto> getBranchHistoryById(Long id) {
        List<Revision<Long, Branch>> bRevisions = branchRepository.findRevisions(id).getContent();
        return bRevisions.stream()
                .map(BranchDto::revision)
                .toList();
    }

    @Override
    @Transactional(propagation = Propagation.SUPPORTS)
    public Optional<Branch> findById(Long branchId) {
        return branchRepository.findOneById(branchId);
    }

    @Override
    @Transactional(propagation = Propagation.SUPPORTS)
    public Optional<Branch> getDefaultBranch() {
        return branchRepository.findFirstByOrderByIdAsc();
    }

    @Override
    public Branch createDefaultBranch(String name, String code, Clinic clinic) {
        String currentTenant = TenantContextHolder.getCurrentTenant();
        UUID uid = UUID.randomUUID();
        BranchDto defaultBranchDto = BranchDto.builder()
                .name(name)
                .code(code)
                .globalBranchId(uid)
                .active(true)
                .primary(currentTenant.equals(defaultTenant) ? false : true)
                .district(new District(1L))
                .clinic(new ClinicDto(clinic))
                .build();

        this.saveOrUpdate(defaultBranchDto);
        Optional<Branch> branch = branchRepository.findByCode(code);

        return branch.get();

    }

    @Override
    public Optional<Branch> getPrimaryBranch() {
        String tenant = TenantContextHolder.getCurrentTenant();
        if (tenant == null) {
            TenantContextHolder.setCurrentTenant(defaultTenant);
            tenant = defaultTenant;
        }

        if (tenant.equalsIgnoreCase(defaultTenant)) {
            return branchRepository.findOneByPrimaryAndCode(true, "CHUB");
        } else {
            return branchRepository.findOneByPrimary(true);
        }
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Optional<Branch> getByGlobalId(UUID globalId) {
        return branchRepository.findByGlobalBranchId(globalId);
    }

    @Override
    public List<Branch> masterBranchFilter(BranchSearch search) {
        String name = search.getName() != null ? search.getName() : "";
        return branchRepository.filterBranchMaster(name);
    }

}
