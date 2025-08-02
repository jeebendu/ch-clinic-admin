package com.jee.clinichub.app.purchase.order.model;



import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.branch.model.BranchDto;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PurchaseOrderDto {
    
    private Long id;
    
    private String uid;
    
    private BranchDto branch;
    
    private VendorDto vendor;
	 
	private PaymentTypeDto paymentType;
	
	private double subtotal;
	
	private double discount;
	
	private double grandTotal;

	private String remark;
	
	private boolean approved;

	private String approvedBy;

	private Date approvedTime;
	

	private double totalDiscount;
	private double paidAmount;
	private double balance;
	

	private double totalGst;
	
	
	List<PurchaseOrderItemDto> items = new ArrayList<PurchaseOrderItemDto>();
    
	
	
	public PurchaseOrderDto(PurchaseOrder purchaseOrder) {
		this.id = purchaseOrder.getId();
		this.uid= purchaseOrder.getUid();
		this.branch = new BranchDto(purchaseOrder.getBranch());
		this.vendor=new VendorDto(purchaseOrder.getVendor());
		this.paymentType = new PaymentTypeDto(purchaseOrder.getPaymentType());
		this.subtotal = purchaseOrder.getSubtotal();
		this.discount = purchaseOrder.getDiscount();
		this.grandTotal = purchaseOrder.getGrandTotal();
		this.totalDiscount = purchaseOrder.getTotalDiscount();
		this.totalGst = purchaseOrder.getTotalGst();
		this.paidAmount = purchaseOrder.getPaidAmount();
		this.balance = purchaseOrder.getBalance();
		this.remark = purchaseOrder.getRemark();
		this.approved = purchaseOrder.isApproved();
		this.approvedBy = purchaseOrder.getApprovedBy();
		this.approvedTime = purchaseOrder.getApprovedTime();
		
		purchaseOrder.getItems().forEach(item->{
			this.items.add(new PurchaseOrderItemDto(item));
		});
		
	}
	

    
    
}