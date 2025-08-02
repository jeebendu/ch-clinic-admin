package com.jee.clinichub.app.admin.subscription.plan.model;

import java.util.Date;
import java.util.Set;
import com.jee.clinichub.app.admin.subscription.feature.model.FeatureProj;

public interface PlanProj {

    Long getId();
    String getName();
    String getDescription();
    Long getPrice();
    Long getSpecialPrice();
    Long getJoiningPrice();
    String getBillingCycle();
    Date getCreatedTime();
   Set<FeatureProj> getFeatureList();
   boolean isActive();

    
}
