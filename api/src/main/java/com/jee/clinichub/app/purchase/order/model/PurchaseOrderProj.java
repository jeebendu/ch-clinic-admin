package com.jee.clinichub.app.purchase.order.model;


import java.util.Date;
import java.util.List;

import com.jee.clinichub.app.core.projections.CommonProj;
import com.jee.clinichub.app.vendor.model.Vendor;

public interface PurchaseOrderProj  {
	
    Long getId();
    String getUid();
    //CommonProj getBranch();
    CommonProj getPaymentType();
    Vendor getVendor();
    double getSubtotal();
    double getDiscount();
    double getGrandTotal();
    double getPaidAmount();
    double getBalance();
    String getRemark();
    boolean isApproved();
    String getApprovedBy();
	Date getApprovedTime();
	List<PurchaseOrderItemPro> getItems();
	
}