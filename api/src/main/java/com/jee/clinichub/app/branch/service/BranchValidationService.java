
package com.jee.clinichub.app.branch.service;

import org.springframework.stereotype.Service;

import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.branch.repository.BranchRepository;
import com.jee.clinichub.global.model.Status;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BranchValidationService {

    private final BranchRepository branchRepository;

    public Status validateBranchForSave(BranchDto branchDto) {
        boolean nameExists = branchRepository.existsByNameAndIdNot(
            branchDto.getName(),
            branchDto.getId() != null ? branchDto.getId() : -1
        );
        
        boolean codeExists = branchRepository.existsByCodeAndIdNot(
            branchDto.getCode(),
            branchDto.getId() != null ? branchDto.getId() : -1
        );

        if (nameExists && codeExists) {
            return new Status(false, "Branch Name Or Code already exists");
        }
        
        if (codeExists) {
            return new Status(false, "Branch Code already exists");
        }

        return new Status(true, "Validation passed");
    }
}
