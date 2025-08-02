
package com.jee.clinichub.app.branch.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.jee.clinichub.app.admin.clinic.allclinic.model.Clinic;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.branch.model.BranchMaster;
import com.jee.clinichub.app.branch.model.BranchSearch;
import com.jee.clinichub.global.model.Status;

public interface BranchService {
	
    // Fetching methods
	List<BranchDto> getAllBranches();
    Page<BranchDto> getAllBranchesPaginated(Pageable pageable);
    Branch findByName(String name);
    BranchDto getById(Long id);
    Branch getBranchById(Long id);
    Optional<Branch> findById(Long branchId);
    Optional<Branch> getDefaultBranch();
    Optional<Branch> getPrimaryBranch();
    Optional<Branch> getByGlobalId(UUID globalId);
    boolean existsByName(String name);
    

    // Modification methods
    Status deleteById(Long id);
    Status saveOrUpdate(BranchDto branchDto);
    
    // History and audit
	List<BranchDto> getBranchHistoryById(Long id);
	Branch createDefaultBranch(String name, String code, Clinic clinic);
    List<BranchMaster> getBranchMasterByClinicId(Long id);
    List<Branch> masterBranchFilter(BranchSearch search);
    
    
}
