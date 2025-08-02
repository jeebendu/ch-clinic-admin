package com.jee.clinichub.app.admin.subscription.feature.service;

import java.util.List;
import com.jee.clinichub.app.admin.subscription.feature.model.FeatureDto;
import com.jee.clinichub.global.model.Status;

public interface FeatureService {

    List<FeatureDto> getAllFeatures();

    FeatureDto getById(Long id);

    Status saveOrUpdate(FeatureDto featureDto);

    Status deleteById(Long id);

}
