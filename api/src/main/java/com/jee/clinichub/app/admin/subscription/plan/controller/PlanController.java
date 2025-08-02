package com.jee.clinichub.app.admin.subscription.plan.controller;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.admin.subscription.plan.model.PlanDto;
import com.jee.clinichub.app.admin.subscription.plan.service.PlanService;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(value = "/v1/plan")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class PlanController {

    private final PlanService planService;

    // @Cacheable(value = "planCache" , keyGenerator =
    // "multiTenantCacheKeyGenerator")
    @GetMapping(value = "/list")
    public List<PlanDto> getAllPlans() {
        return planService.getAllPlans();
    }

    @GetMapping(value = "/id/{id}")
    public PlanDto getById(@PathVariable Long id) {
        return planService.getById(id);
    }

    @CacheEvict(value = "planCache", allEntries = true, keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value = "/saveOrUpdate")
    @ResponseBody
    public Status saveBranch(@RequestBody @Valid PlanDto plan, HttpServletRequest request, Errors errors) {
        return planService.saveOrUpdate(plan);
    }

    @CacheEvict(value = "planCache", allEntries = true, keyGenerator = "multiTenantCacheKeyGenerator")
    @DeleteMapping(value = "/delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
        return planService.deleteById(id);
    }

    @GetMapping(value = "/change-status/id/{id}")
    public Status changeStatus(@PathVariable Long id) {
        return planService.changeStatus(id);
    }

}
