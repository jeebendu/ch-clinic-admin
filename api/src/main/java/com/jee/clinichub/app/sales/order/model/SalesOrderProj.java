package com.jee.clinichub.app.sales.order.model;


import java.util.Date;
import java.util.List;

import com.jee.clinichub.app.core.projections.CommonProj;
import com.jee.clinichub.app.customer.model.Customer;

public interface SalesOrderProj  {
	
    Long getId();
    String getUid();
    //CommonProj getBranch();
    CommonProj getPaymentType();
    double getSubtotal();
    double getDiscount();
    double getGrandTotal();
    String getRemark();
    boolean isApproved();
    String getApprovedBy();
	Date getApprovedTime();
	Date getCreatedTime();
	Customer getCustomer();
	List<SalesOrderItemPro> getItems();
	
}