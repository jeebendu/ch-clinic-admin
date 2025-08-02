package com.jee.clinichub.app.purchase.order.model;

public interface PurchaseOrderItemPro  {
	
    Long getId();
    Double getPrice();
    Integer getQty();
    Double getTotal();
    String getRemark();

    
	
}