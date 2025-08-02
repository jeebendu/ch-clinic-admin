package com.jee.clinichub.app.expense.model;

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
import com.jee.clinichub.app.payment.type.model.PaymentType;
import com.jee.clinichub.app.staff.model.Staff;
import com.jee.clinichub.app.staff.model.StaffDto;
import com.jee.clinichub.config.audit.Auditable;

import lombok.AllArgsConstructor;
import lombok.Builder;
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
@Builder
@Table(name = "expense")
@EntityListeners(AuditingEntityListener.class)
public class Expense extends Auditable<String>  implements Serializable {


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
	
	
	
	@Column(name="subtotal")
	private double subtotal;
	
	
	@Column(name="discount")
	private double discount;
	
	@Column(name="grand_total")
	private double grandTotal;

	
	@Column(name="remark")
	private String remark;
	
	@Column(name="expense_time")
	private Date expenseTime;
	
	@Column(name="is_approved")
	private boolean approved;
	
	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "approved_by", nullable = true)
	private Staff approvedBy;
	
	@Column(name="approved_time")
	private Date approvedTime;
	

	@JsonManagedReference
	@OneToMany(mappedBy = "expense",cascade=CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
	List<ExpenseItem> items = new ArrayList<ExpenseItem>();
	
	
	public Expense(ExpenseDto expenseDto) {
		super();
		this.id = expenseDto.getId();
		this.uid = expenseDto.getUid();
		if(expenseDto.getBranch()!=null)
		this.branch = new Branch(expenseDto.getBranch());
		this.paymentType = new PaymentType(expenseDto.getPaymentType());
		this.subtotal = expenseDto.getSubtotal();
		this.discount = expenseDto.getDiscount();
		this.grandTotal = expenseDto.getGrandTotal();
		this.remark = expenseDto.getRemark();
		this.approved = expenseDto.isApproved();
		if(expenseDto.getApprovedBy()!=null){
			this.approvedBy = new Staff(expenseDto.getApprovedBy());
		}
		this.approvedTime = expenseDto.getApprovedTime();
		this.expenseTime = expenseDto.getExpenseTime();
		
		expenseDto.getItems().forEach(item->{
			ExpenseItem exItem = new ExpenseItem(item);
			exItem.setExpense(this);
			this.items.add(exItem);
		});
		
	}



	public Expense(Long expenseId) {
		this.id = expenseId;
	}

	
}