
package com.jee.clinichub.app.branch.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.branch.model.BranchMaster;
import com.jee.clinichub.app.branch.service.BranchService;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequestMapping("/v1/branch")
@RequiredArgsConstructor
public class BranchController {

    private final BranchService branchService;

    @GetMapping("/list")
    public List<BranchDto> getAllBranches() {
       return branchService.getAllBranches();
      
    }

    @GetMapping("/list/paginated")
    public ResponseEntity<Page<BranchDto>> getAllBranchesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Fetching branches with pagination - page: {}, size: {}", page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<BranchDto> branches = branchService.getAllBranchesPaginated(pageable);
        return ResponseEntity.ok(branches);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<BranchDto> getBranchById(@PathVariable Long id) {
        log.info("Fetching branch with ID: {}", id);
        BranchDto branch = branchService.getById(id);
        return ResponseEntity.ok(branch);
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<BranchDto> getBranchByName(@PathVariable String name) {
        log.info("Fetching branch with name: {}", name);
        BranchDto branch = BranchDto.fromBranch(branchService.findByName(name));
        return ResponseEntity.ok(branch);
    }

    @PostMapping("/saveOrUpdate")
    public ResponseEntity<Status> saveOrUpdate(@Valid @RequestBody BranchDto branchDto) {
        log.info("Saving/updating branch: {}", branchDto.getName());
        Status status = branchService.saveOrUpdate(branchDto);
        return ResponseEntity.ok(status);
    }

    @GetMapping("/delete/id/{id}")
    public ResponseEntity<Status> deleteById(@PathVariable Long id) {
        log.info("Deleting branch with ID: {}", id);
        Status status = branchService.deleteById(id);
        return ResponseEntity.ok(status);
    }

    @GetMapping("/exists/name/{name}")
    public ResponseEntity<Boolean> existsByName(@PathVariable String name) {
        log.info("Checking if branch exists with name: {}", name);
        boolean exists = branchService.existsByName(name);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/history/{id}")
    public ResponseEntity<List<BranchDto>> getBranchHistory(@PathVariable Long id) {
        log.info("Fetching history for branch ID: {}", id);
        List<BranchDto> history = branchService.getBranchHistoryById(id);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/default")
    public ResponseEntity<BranchDto> getDefaultBranch() {
        log.info("Fetching default branch");
        return branchService.getDefaultBranch()
                .map(branch -> ResponseEntity.ok(BranchDto.fromBranch(branch)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/admin/list/clinic/{id}")
    public List<BranchMaster> getBranchMasterByClinicId(@PathVariable Long id) {
        return  branchService.getBranchMasterByClinicId(id);       
    }
}
