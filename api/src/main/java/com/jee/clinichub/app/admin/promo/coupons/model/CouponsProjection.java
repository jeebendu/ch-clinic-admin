package com.jee.clinichub.app.admin.promo.coupons.model;

import java.util.Date;

public interface CouponsProjection {

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

    
}
