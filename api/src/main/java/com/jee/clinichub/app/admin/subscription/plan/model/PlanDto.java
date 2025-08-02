package com.jee.clinichub.app.admin.subscription.plan.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;  

import com.jee.clinichub.app.admin.subscription.feature.model.Feature;
import com.jee.clinichub.app.admin.subscription.feature.model.FeatureDto;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlanDto {
    private Long id;
    private String name;
    private String description;
    private Long price;
    private boolean active;
    private Long specialPrice;
    private Long joiningPrice;

    private BillingCycleName billingCycle;
    private Date createdTime;
    private Date updatedTime;
    

    private Set<FeatureDto> featureList;

    public PlanDto(Plan plan) {
        this.id = plan.getId();
        this.name = plan.getName();
        this.description = plan.getDescription();
        this.price = plan.getPrice();
        this.specialPrice = plan.getSpecialPrice();
        this.joiningPrice = plan.getJoiningPrice();
        this.billingCycle = plan.getBillingCycle();
        this.createdTime = plan.getCreatedTime();
        this.active=plan.isActive();
        
     if(plan.getFeatureList()!=null){
       this.featureList= plan.getFeatureList().stream().map(FeatureDto::new).collect(Collectors.toSet());
    }
    }

}
