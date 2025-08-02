package com.jee.clinichub.app.admin.subscription.plan.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jee.clinichub.app.admin.subscription.feature.model.Feature;
import com.jee.clinichub.app.admin.subscription.feature.repository.FeatureRepository;
import com.jee.clinichub.app.admin.subscription.plan.model.Plan;
import com.jee.clinichub.app.admin.subscription.plan.model.PlanDto;
import com.jee.clinichub.app.admin.subscription.plan.repository.PlanRepository;
import com.jee.clinichub.global.model.Status;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service(value = "PlanService")
@RequiredArgsConstructor
public class PlanServiceImpl implements PlanService {

    private final PlanRepository planRepository;
    private final FeatureRepository featureRepository;

    @Override
    public List<PlanDto> getAllPlans() {

        return planRepository.findAll().stream()
                .map(PlanDto::new)
                .toList();
    }

    @Override
    public PlanDto getById(Long id) {
        return planRepository.findById(id)
                .map(PlanDto::new)
                .orElseThrow(() -> new EntityNotFoundException("Plan not found with ID: " + id));

    }

    @Override
    public Status deleteById(Long id) {
        planRepository.findById(id).ifPresentOrElse(
                branch -> {
                    planRepository.deleteById(id);
                },
                () -> {
                    throw new EntityNotFoundException("Plan not found with ID: " + id);
                });
        return new Status(true, "Deleted Successfully");
    }

    @Override
    public Status saveOrUpdate(@RequestBody PlanDto planDto) {
        try {
            Plan plan = planDto.getId() == null ? new Plan(planDto) : setPlan(planDto);
            planRepository.save(plan);
            return new Status(true, planDto.getId() == null ? "Plan saved successfully" : "Plan updated successfully");
        } catch (Exception e) {
            return new Status(false, "Something went wrong");
        }
    }

    public Plan setPlan(PlanDto planDto) {
        return planRepository.findById(planDto.getId()).map(p -> {
            p.setName(planDto.getName());
            p.setDescription(planDto.getDescription());
            p.setPrice(planDto.getPrice());
            p.setSpecialPrice(planDto.getSpecialPrice());
            p.setJoiningPrice(planDto.getJoiningPrice());
            p.setBillingCycle(planDto.getBillingCycle());
            p.setActive(planDto.isActive());

            // Get the list of Feature from the plan
            if (planDto.getFeatureList() != null) {
                Set<Feature> features = planDto.getFeatureList().stream().map(Feature::new).collect(Collectors.toSet());
                p.setFeatureList(features);
            }
            return p;

        }).orElseThrow(() -> new EntityNotFoundException("Plan with id" + planDto.getId() + "not found"));

    }

    @Override
    public Status changeStatus(Long id) {
        try {
            Plan exist = new Plan();
            Optional<Plan> planOptional = planRepository.findById(id);

            if (planOptional.isEmpty()) {
                throw new EntityNotFoundException("Plan not found with id: " + id);
            }

            exist = planOptional.get();
            boolean isActive = !exist.isActive();
            exist.setActive(isActive);
            exist = planRepository.save(exist);

            return new Status(true,
                    "Plan with id:" + id + (exist.isActive() ? " is Activated" : "is Deactivated"));
        } catch (

        Exception e) {
            return new Status(false, "Something went wrong while updating plan status");
        }
    }

}