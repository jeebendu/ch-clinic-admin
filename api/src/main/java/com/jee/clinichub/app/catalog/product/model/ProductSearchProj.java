package com.jee.clinichub.app.catalog.product.model;


import java.math.BigDecimal;

import com.jee.clinichub.app.catalog.type.model.ProductTypeProj;
import com.jee.clinichub.app.core.projections.CommonProj;

public interface ProductSearchProj  {
	
    Long getId();
    String getName();
    CommonProj getBrand();
    ProductTypeProj getType();
    
    Integer getQty();
    Integer getQtyLoose();
    String getRackNo();
    BigDecimal getPrice();
   
    
}