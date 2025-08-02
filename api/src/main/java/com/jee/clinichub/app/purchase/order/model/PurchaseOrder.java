package com.jee.clinichub.app.purchase.order.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.payment.type.model.PaymentType;
import com.jee.clinichub.app.vendor.model.Vendor;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
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
@Table(name = "purchase_order")
@EntityListeners(AuditingEntityListener.class)
public class PurchaseOrder extends Auditable<String>  implements Serializable {
	

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	
	@Column(name="uid")
	private String uid;
	

	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "branch_id", nullable = false)
	private Branch branch;
	 
	
	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "payment_type_id", nullable = false)
	private PaymentType paymentType;
	
	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "vendor_id", nullable = false)
	private Vendor vendor;
	
	@Column(name="subtotal")
	private double subtotal;
	
	
	@Column(name="total_discount")
	private Double totalDiscount;
	
	@Column(name="total_gst")
	private Double totalGst;
	
	
	
	
	@Column(name="discount")
	private double discount;
	
	@Column(name="grand_total")
	private double grandTotal;

	@Column(name="paid_amount")
	private double paidAmount;
	
	@Column(name="balance")
	private double balance;
	
	@Column(name="remark")
	private String remark;
	

	
	@Column(name="is_approved")
	private boolean approved;
	
	@Column(name="approved_by")
	private String approvedBy;
	
	@Column(name="approved_time")
	private Date approvedTime;
	

	@JsonManagedReference
	@OneToMany(mappedBy = "purchaseOrder",cascade=CascadeType.ALL, fetch = FetchType.EAGER)
	List<PurchaseOrderItem> items = new ArrayList<PurchaseOrderItem>();

	
	public PurchaseOrder(PurchaseOrderDto purchaseOrderDto) {
		super();
		this.id = purchaseOrderDto.getId();
		this.uid=purchaseOrderDto.getUid();
		
		if(purchaseOrderDto.getBranch()!=null)
		this.branch = new Branch(purchaseOrderDto.getBranch());
		if(purchaseOrderDto.getVendor()!=null)
			this.vendor= new Vendor(purchaseOrderDto.getVendor());
		if(purchaseOrderDto.getPaymentType()!=null)
		this.paymentType = new PaymentType(purchaseOrderDto.getPaymentType());
		this.subtotal = purchaseOrderDto.getSubtotal();
		this.discount = purchaseOrderDto.getDiscount();
		this.grandTotal = purchaseOrderDto.getGrandTotal();
		this.totalDiscount = purchaseOrderDto.getTotalDiscount();
		this.totalGst = purchaseOrderDto.getTotalGst();
		this.paidAmount = purchaseOrderDto.getPaidAmount();
		this.balance = purchaseOrderDto.getBalance();
		this.remark = purchaseOrderDto.getRemark();
		this.approved = purchaseOrderDto.isApproved();
		this.approvedBy = purchaseOrderDto.getApprovedBy();
		this.approvedTime = purchaseOrderDto.getApprovedTime();
		
		purchaseOrderDto.getItems().forEach(item->{
			PurchaseOrderItem orderItem = new PurchaseOrderItem(item);
			orderItem.setPurchaseOrder(this);
			this.items.add(orderItem);

					});
		
	}



	public PurchaseOrder(Long orderId) {
		this.id = orderId;
	}

	
}