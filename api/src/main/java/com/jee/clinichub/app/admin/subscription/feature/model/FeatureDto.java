package com.jee.clinichub.app.admin.subscription.feature.model;
import com.jee.clinichub.app.admin.subscription.plan.model.Plan;
import com.jee.clinichub.app.admin.subscription.plan.model.PlanDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;




@Builder
@Data
@AllArgsConstructor 
@NoArgsConstructor
public class FeatureDto {
 
    
private Long id;
private String name;
private String description;
private boolean active;

public FeatureDto(Feature feature) {
    this.id = feature.getId();
    this.name = feature.getName();
    this.description = feature.getDescription();

}

}
