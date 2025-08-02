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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PurchaseOrderItemDto {
    
    private Long id;
	private double price;
	private double mrp;
	private Integer qty;
	private double total;
	private String remark;
	private ProductDto product;
	private PurchaseOrderDto purchaseOrder;
	private Integer freeQty=0;
	private String hsnCode;
	private String pack;
	
	private double discountPercent;
	private String batch;
	private double discountAmount;
	private double gstPercent;
	
	private Integer manufactureMonth=0;
	private Integer manufactureYear=0;
	private Integer expiryMonth;
	private Integer expiryYear;
	
	private double taxAmount;
	private String mfg;
	
	
    
	
	
	public PurchaseOrderItemDto(PurchaseOrderItem purchaseOrderItem) {
		
		this.id = purchaseOrderItem.getId();
		this.price = purchaseOrderItem.getPrice();
		this.mrp=purchaseOrderItem.getMrp();
		this.qty = purchaseOrderItem.getQty();
		this.total=purchaseOrderItem.getTotal();
		this.manufactureMonth=purchaseOrderItem.getManufactureMonth();
		this.manufactureYear=purchaseOrderItem.getManufactureYear();
		this.expiryMonth=purchaseOrderItem.getExpiryMonth();
		this.expiryYear=purchaseOrderItem.getExpiryYear();
		this.freeQty = purchaseOrderItem.getFreeQty();
		
		this.discountPercent=purchaseOrderItem.getDiscountPercent();
		this.batch=purchaseOrderItem.getBatch();
		this.discountAmount=purchaseOrderItem.getDiscountAmount();
		this.gstPercent=purchaseOrderItem.getGstPercent();
		this.taxAmount=purchaseOrderItem.getTaxAmount();
		this.hsnCode=purchaseOrderItem.getHsnCode();
		this.product=new ProductDto(purchaseOrderItem.getProduct());
		this.pack=purchaseOrderItem.getPack();
		this.mfg=purchaseOrderItem.getMfg();
		
	}


	public void setExpiryDate(ExpiryDate expiryDate) {
		this.setExpiryMonth(expiryDate.getMonth());
		this.setExpiryYear(expiryDate.getYear());
	}
	

    
    
}