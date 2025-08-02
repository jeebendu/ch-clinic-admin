package com.jee.clinichub.app.purchase.order.model;



import java.util.Date;

import jakarta.persistence.Column;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.catalog.product.model.Product;
import com.jee.clinichub.app.catalog.product.model.ProductDto;
import com.jee.clinichub.app.payment.type.model.PaymentTypeDto;
import com.jee.clinichub.app.purchase.order.model.PurchaseOrderItem.ExpiryDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderScanItem {
    
    private String id;
    private String name;
    private String price;
    private String mrp;
    private String qty;
    private String total;
    private String remark;
    private ProductDto product;
    private PurchaseOrderDto purchaseOrder;
    private String freeQty = "0";
    private String hsnCode;
    private String pack;
    
    private String discountPercent;
    private String batch;
    private String discountAmount;
    private String gstPercent;
    
    private String manufactureMonth = "0";
    private String manufactureYear = "0";
    private String expiryDate;
    
    private String taxAmount;
    private String mfg;
	
	
    
}