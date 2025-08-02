package com.jee.clinichub.app.admin.subscription.feature.service;

import java.util.List;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.admin.subscription.feature.model.Feature;
import com.jee.clinichub.app.admin.subscription.feature.model.FeatureDto;
import com.jee.clinichub.app.admin.subscription.feature.repository.FeatureRepository;
import com.jee.clinichub.app.admin.subscription.plan.model.Plan;
import com.jee.clinichub.app.admin.subscription.plan.model.PlanDto;
import com.jee.clinichub.app.admin.subscription.plan.service.PlanService;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service(value = "FeatureService")
@RequiredArgsConstructor
public class FeatureServiceImpl implements FeatureService {

    private  final FeatureRepository featureRepository;

    @Override
    public List<FeatureDto> getAllFeatures() {
        return featureRepository.findAll().stream()
                .map(FeatureDto::new)
                .toList();
    }

    @Override
    public FeatureDto getById(Long id) {
        return featureRepository.findById(id)
                .map(FeatureDto::new)
                .orElseThrow(() -> new EntityNotFoundException("Feature not found with ID: " + id));

    }

    @Override
    public Status saveOrUpdate(FeatureDto featureDto) {
        try {
            Feature feature = featureDto.getId() == null ? new Feature(featureDto) : setFeature(featureDto);
            featureRepository.save(feature);
            return new Status(true,
            featureDto.getId() == null ? "Feature saved successfully" : "Feature updated successfully");
        } catch (Exception e) {
            return new Status(false, "Something went wrong");
        }
    }

    public Feature setFeature(FeatureDto feature) {
        return featureRepository.findById(feature.getId()).map(p -> {
            p.setName(feature.getName());
            p.setDescription(feature.getDescription());
            return p;
        }).orElseThrow(() -> new EntityNotFoundException("Feature with id" + feature.getId() + "not found"));

    }

    @Override
    public Status deleteById(Long id) {
        featureRepository.findById(id).ifPresentOrElse(
                branch -> {
                    featureRepository.deleteById(id);
                },
                () -> {
                    throw new EntityNotFoundException("Feature not found with ID: " + id);
                });
        return new Status(true, "Deleted Successfully");
    }

}
