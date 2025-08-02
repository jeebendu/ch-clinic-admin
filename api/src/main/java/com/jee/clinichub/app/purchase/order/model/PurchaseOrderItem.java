package com.jee.clinichub.app.purchase.order.model;

import java.io.Serializable;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.jee.clinichub.app.catalog.product.model.Product;
import com.jee.clinichub.app.catalog.product.model.ProductDto;
import com.jee.clinichub.config.audit.Auditable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;




/**
 * The persistent class for the role database table.
 * 
 */
@Data
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
@Entity
@Table(name = "purchase_order_items")
@EntityListeners(AuditingEntityListener.class)
public class    PurchaseOrderItem extends Auditable<String>  implements Serializable {
	

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	

	@JsonBackReference
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "purchase_order_id")
	private PurchaseOrder purchaseOrder;
	 
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "product_id")
	private Product product;
	
	@Column(name="hsn_code")
	private String hsnCode;
	
	@Column(name="pack")
	private String pack;
	
	@Column(name="mfg")
	private String mfg;
	

	
	@Column(name="discount_percent")
	private double discountPercent;
	
	@Column(name="batch")
	private String batch;
	
	@Column(name="discount_amount")
	private double discountAmount;
	
	@Column(name="gst_percent")
	private double gstPercent;
	
	@Column(name="tax_amount")
	private double taxAmount;
	
	@Column(name="mrp")
	private double mrp;
	
	@Column(name="price")
	private double price;

	
	@Column(name="qty")
	private Integer qty;
	
	@Column(name="free_qty")
	private Integer freeQty;
	
	@Column(name="manufacture_month")
	private Integer manufactureMonth;
	
	@Column(name="manufacture_year")
	private Integer manufactureYear;
	
	@Column(name="expiry_month")
	private Integer expiryMonth;
	
	@Column(name="expiry_year")
	private Integer expiryYear;
	
	
	@Column(name="total")
	private double total;
	
	@Column(name="remark")
	private String remark;
	


	public PurchaseOrderItem(PurchaseOrderItemDto purchaseOrderItemDto) {
		super();
		if(purchaseOrderItemDto.getId()!=null){
			this.id = purchaseOrderItemDto.getId();
		}
		//if(purchaseOrderItemDto.getProduct().getId()!=null) {
			this.product = new Product(purchaseOrderItemDto.getProduct());
		//}
		this.hsnCode=purchaseOrderItemDto.getHsnCode();
		this.pack=purchaseOrderItemDto.getPack();
		this.mfg=purchaseOrderItemDto.getMfg();
		this.manufactureMonth=purchaseOrderItemDto.getManufactureMonth();
		this.manufactureYear=purchaseOrderItemDto.getManufactureYear();
		this.expiryMonth=purchaseOrderItemDto.getExpiryMonth();
		this.expiryYear=purchaseOrderItemDto.getExpiryYear();
		
	
		this.discountPercent=purchaseOrderItemDto.getDiscountPercent();
		this.batch=purchaseOrderItemDto.getBatch();
		this.discountAmount=purchaseOrderItemDto.getDiscountAmount();
		this.gstPercent=purchaseOrderItemDto.getGstPercent();
		this.taxAmount=purchaseOrderItemDto.getTaxAmount();
		
		this.mrp=purchaseOrderItemDto.getMrp();
		this.price = purchaseOrderItemDto.getPrice();
		this.qty = purchaseOrderItemDto.getQty();
		this.freeQty = purchaseOrderItemDto.getFreeQty();
		this.total = purchaseOrderItemDto.getTotal();
		this.remark=purchaseOrderItemDto.getRemark();
		
	}



	



	public PurchaseOrderItem(Long purchaseOrderId) {
		this.id = purchaseOrderId;
	}


	@Data
	@AllArgsConstructor
	@NoArgsConstructor
	public static class ExpiryDate {
		private int month;
		private int year;
	}
	
}