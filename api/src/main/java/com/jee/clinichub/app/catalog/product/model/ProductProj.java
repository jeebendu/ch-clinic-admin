package com.jee.clinichub.app.catalog.product.model;


import java.math.BigDecimal;

import com.jee.clinichub.app.core.projections.CommonProj;

public interface ProductProj  {
	
    Long getId();
    //String getUid();
    CommonProj getType();
    CommonProj getCategory();
    CommonProj getBrand();
    //BatchProj  getBatch();
    String getName();
    Integer getQty();
    Integer getQtyLoose();
    String getRackNo();
    BigDecimal getPrice();
    //Integer getExpiryMonth();
    //Integer getExpiryYear();
    
    
    
	
}