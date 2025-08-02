package com.jee.clinichub.app.sales.order.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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
import jakarta.persistence.Transient;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.customer.model.Customer;
import com.jee.clinichub.app.payment.type.model.PaymentType;
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
@Table(name = "sales_order")
@EntityListeners(AuditingEntityListener.class)
public class SalesOrder extends Auditable<String>  implements Serializable {
	

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	@OneToOne(fetch = FetchType.EAGER,cascade=CascadeType.ALL)
	@JoinColumn(name = "customer_id", nullable = false)
	private Customer customer;
	
	@Column(name="uid")
	private String uid;
	

	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "branch_id", nullable = false)
	private Branch branch;
	 
	
	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "payment_type_id", nullable = false)
	private PaymentType paymentType;
	
	

	@Column(name="subtotal")
	private double subtotal;
	
	
	@Column(name="discount")
	private double discount;
	
	@Column(name="grand_total")
	private double grandTotal;
	
	@Column(name="paid_amount")
	private double paidAmount;
	
	@Column(name="balance")
	private double balance;
	
	@Column(name="discount_type")
	private String discountType;
	
	@Column(name="discount_value")
	private double discountValue;

	
	@Column(name="remark")
	private String remark;
	
	@Column(name="is_approved")
	private boolean approved;
	
	@Column(name="approved_by")
	private String approvedBy;
	
	@Column(name="approved_time")
	private Date approvedTime;
	

	@JsonManagedReference
	@OneToMany(mappedBy = "salesOrder",cascade=CascadeType.ALL, fetch = FetchType.EAGER)
	List<SalesOrderItem> items = new ArrayList<SalesOrderItem>();
	
	
	public SalesOrder(SalesOrderDto salesOrderDto) {
		super();
		this.id = salesOrderDto.getId();
		this.uid=salesOrderDto.getUid();
		if(salesOrderDto.getBranch()!=null)
		this.branch = new Branch(salesOrderDto.getBranch());
		this.customer = new Customer(salesOrderDto.getCustomer());
		this.paymentType = new PaymentType(salesOrderDto.getPaymentType());
		this.subtotal = salesOrderDto.getSubtotal();
		this.discount = salesOrderDto.getDiscount();
		this.discountType = salesOrderDto.getDiscountType();
		this.discountValue = salesOrderDto.getDiscountValue();
		this.grandTotal = salesOrderDto.getGrandTotal();
		this.remark = salesOrderDto.getRemark();
		this.approved = salesOrderDto.isApproved();
		this.approvedBy = salesOrderDto.getApprovedBy();
		this.approvedTime = salesOrderDto.getApprovedTime();
		this.paidAmount = salesOrderDto.getPaidAmount();
		this.balance = salesOrderDto.getBalance();
		
		salesOrderDto.getItems().forEach(item->{
			SalesOrderItem orderItem = new SalesOrderItem(item);
			orderItem.setSalesOrder(this);
			this.items.add(orderItem);
		});
		
	}



	public SalesOrder(Long orderId) {
		this.id = orderId;
	}

	
}