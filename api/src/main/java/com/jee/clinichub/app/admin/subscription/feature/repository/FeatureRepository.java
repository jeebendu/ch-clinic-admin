package com.jee.clinichub.app.admin.subscription.feature.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jee.clinichub.app.admin.subscription.feature.model.Feature;

public interface FeatureRepository  extends JpaRepository<Feature, Long> {
    
}
