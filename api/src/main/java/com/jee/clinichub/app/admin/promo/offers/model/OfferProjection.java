package com.jee.clinichub.app.admin.promo.offers.model;

import java.util.Date;
import java.util.Set;

import com.jee.clinichub.app.admin.subscription.plan.model.Plan;
import com.jee.clinichub.app.admin.subscription.plan.model.PlanDto;

public interface OfferProjection {


     Long getId();
    String getName();
    String getCodee();
    Long getDiscount();
    String getDiscountType();
    Date getStartDate();
    Date getEndDate();
    Long getMinOrderAmount();
    Long getMaxDiscount();
    Integer getLimitPerUser();
    String getImage();
    String getDescription();
   
    
    // Set<PlanDto> getPlanList();
    Set<Plan> getPlanList();
}
