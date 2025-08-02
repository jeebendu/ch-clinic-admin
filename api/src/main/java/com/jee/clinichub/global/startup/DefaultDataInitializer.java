package com.jee.clinichub.global.startup;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.repository.BranchRepository;
import com.jee.clinichub.app.core.district.model.District;
import com.jee.clinichub.app.core.sequence.service.SequenceService;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Component
@RequiredArgsConstructor
public class DefaultDataInitializer implements ApplicationRunner {

    private final BranchRepository branchRepository;
    private final SequenceService sequenceService;
    
    @Value("${app.default-tenant}")
    private String defaultTenant;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        String originalTenant = TenantContextHolder.getCurrentTenant();
        
        try {
            // Switch to default/master tenant context
            TenantContextHolder.setCurrentTenant(defaultTenant);
            
            // Check if default branch already exists
            if (!branchRepository.existsByName("Clinic Hub")) {
                createDefaultBranch();
                log.info("Default branch created in master schema on startup");
            } else {
                log.info("Default branch already exists in master schema");
            }
            
        } catch (Exception e) {
            log.error("Error creating default branch on startup: {}", e.getMessage(), e);
        } finally {
            // Restore original tenant context
            TenantContextHolder.setCurrentTenant(originalTenant);
        }
    }

    private void createDefaultBranch() {
        Branch defaultBranch = Branch.builder()
            .name("Clinic Hub")
            .code("CHUB")
            .location("Main Location")
            .city("Default City")
            .active(true)
            .primary(true)
            .district(new District(1L)) // Assuming district with ID 1 exists
            .build();
            
        branchRepository.save(defaultBranch);
        
      //craete the sequence for the new Branch 
		sequenceService.createDefaultSequencesForBranch(defaultBranch);
		
        log.info("Successfully created default branch with name: {}", defaultBranch.getName());
    }
}