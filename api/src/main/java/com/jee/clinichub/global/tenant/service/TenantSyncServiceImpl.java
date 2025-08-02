package com.jee.clinichub.global.tenant.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.jee.clinichub.app.admin.clinic.allclinic.model.Clinic;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicMaster;
import com.jee.clinichub.app.admin.clinic.allclinic.repository.ClinicMasterRepository;
import com.jee.clinichub.app.admin.clinic.allclinic.repository.ClinicRepository;
import com.jee.clinichub.app.branch.context.BranchContextHolder;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.branch.repository.BranchRepository;
import com.jee.clinichub.app.core.sequence.service.SequenceService;
import com.jee.clinichub.app.staff.service.StaffService;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;
import com.jee.clinichub.global.tenant.model.TenantRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class TenantSyncServiceImpl {
	
	private final ClinicRepository clinicRepository;
	private final BranchRepository branchRepository;
	private final SequenceService sequenceService;
	private final StaffService staffService;
	
	
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	Status createClinicAndStaffInTenantSchema(TenantRequest tenantRequest, ClinicMaster clinicMaster,BranchDto branchDto) {
		
		String originalTenantContext = TenantContextHolder.getCurrentTenant();
        try {
            
        	//Create a clinic in tenant same copy of master
            Clinic clinic = new Clinic(clinicMaster);
            clinic.setId(null);
			clinicRepository.save(clinic);
			log.info("Seeded clinic data for tenant: {}", originalTenantContext);
			
			//Create a Barnch in tenant same copy of master
			branchDto.setId(null);
			Branch branchEntity = new Branch(branchDto);
			branchEntity.setPrimary(true);
			branchEntity.setGlobalBranchId(branchDto.getGlobalBranchId());
			branchEntity.setClinic(clinic);
			branchRepository.save(branchEntity);
			
			//craete the sequence for the new Branch 
			sequenceService.createDefaultSequencesForBranch(branchEntity);
			
			//create a new User 
			BranchContextHolder.setCurrentBranch(branchEntity);
			staffService.createStaffFromTenantRequest(tenantRequest, branchEntity);
			
			return new Status(true,"Tenant data creation done");

        } catch (Exception e) {
            log.error("Error syncing branch to master schema. Branch name: '{}', GlobalBranchId: {}, Source tenant: {}. Error: {}",
                    clinicMaster.getName(), clinicMaster.getName(), originalTenantContext, e.getMessage(), e);
            throw new RuntimeException("Failed to sync branch to master schema for GlobalBranchId: " + clinicMaster.getName(), e);
        } 
		
	}

}
