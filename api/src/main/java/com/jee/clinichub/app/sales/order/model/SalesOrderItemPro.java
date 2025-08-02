package com.jee.clinichub.app.sales.order.model;

public interface SalesOrderItemPro  {
	
    Long getId();
    Double getPrice();
    Integer getQty();
    Double getTotal();
    String getDescription();
	
}