
package com.jee.clinichub.app.branch.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.branch.model.BranchMaster;
import com.jee.clinichub.app.branch.model.BranchSearch;
import com.jee.clinichub.app.branch.service.BranchService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequestMapping("/v1/public/branch")
@RequiredArgsConstructor
public class BranchPublicController {

    private final BranchService branchService;

    @GetMapping("/list")
    public List<BranchDto> getAllBranches() {
        return branchService.getAllBranches();
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<BranchDto> getBranchByName(@PathVariable String name) {
        log.info("Fetching branch with name: {}", name);
        BranchDto branch = BranchDto.fromBranch(branchService.findByName(name));
        return ResponseEntity.ok(branch);
    }

        @PostMapping("/search")
    public List<Branch> masterBranchFilter(@RequestBody BranchSearch search) {
        return branchService.masterBranchFilter(search);
    }

}
