package com.jee.clinichub.app.purchase.order.model;

import java.util.ArrayList;
import java.util.List;

import com.jee.clinichub.app.payment.type.model.PaymentTypeDto;
import com.jee.clinichub.app.vendor.model.VendorDto;

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
public class PurchaseOrderScan {
    
	private VendorDto vendor;
	private PaymentTypeDto paymentType;
	private String subtotal;
    private String discount;
    private String grandTotal;
    private String remark;
    private String approved;
    private String approvedBy;
    private String approvedTime;
    private String totalDiscount;
    private String paidAmount;
    private String balance;
    private String totalGst;
    
    List<PurchaseOrderScanItem> items = new ArrayList<PurchaseOrderScanItem>();
}