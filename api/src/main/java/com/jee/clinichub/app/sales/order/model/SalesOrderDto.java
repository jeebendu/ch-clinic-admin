package com.jee.clinichub.app.sales.order.model;



import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.customer.model.CustomerDto;
import com.jee.clinichub.app.payment.type.model.PaymentTypeDto;
import com.jee.clinichub.global.utility.DateUtility;

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
public class SalesOrderDto {
    
    private Long id;
    
    private String uid;
    private String orderDate;
    
    private BranchDto branch;
	 
	private PaymentTypeDto paymentType;
	
	private CustomerDto customer;
	
	private double subtotal;
	
	private double discount;
	
	private double discountValue ;
	
	private String discountType;
	
	private double grandTotal;
	
	private double paidAmount;
	
	private double balance;

	private String remark;
	
	private boolean approved;

	private String approvedBy;

	private Date approvedTime;
	
	List<SalesOrderItemDto> items = new ArrayList<SalesOrderItemDto>();
    
	
	
	public SalesOrderDto(SalesOrder salesOrder) {
		this.id = salesOrder.getId();
		this.uid=salesOrder.getUid();
		this.orderDate=DateUtility.dateToString(salesOrder.getCreatedTime());
		this.branch = new BranchDto(salesOrder.getBranch());
		this.customer = new CustomerDto(salesOrder.getCustomer());
		this.paymentType = new PaymentTypeDto(salesOrder.getPaymentType());
		this.subtotal = salesOrder.getSubtotal();
		this.discount = salesOrder.getDiscount();
		this.discountType = salesOrder.getDiscountType();
		this.discountValue = salesOrder.getDiscountValue();
		this.grandTotal = salesOrder.getGrandTotal();
		this.remark = salesOrder.getRemark();
		this.approved = salesOrder.isApproved();
		this.approvedBy = salesOrder.getApprovedBy();
		this.approvedTime = salesOrder.getApprovedTime();
		this.paidAmount = salesOrder.getPaidAmount();
		this.balance = salesOrder.getBalance();
		
		salesOrder.getItems().forEach(item->{
			this.items.add(new SalesOrderItemDto(item));
		});
		
	}
	

    
    
}