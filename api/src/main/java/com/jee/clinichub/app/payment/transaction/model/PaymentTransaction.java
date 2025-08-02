package com.jee.clinichub.app.payment.transaction.model;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.jee.clinichub.app.branch.model.Branch;
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
@Table(name = "payment_transaction")
@EntityListeners(AuditingEntityListener.class)
public class PaymentTransaction extends Auditable<String>  implements Serializable {
	

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	
	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "branch_id", nullable = false)
	private Branch branch;
	 
	
	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "payment_type_id", nullable = false)
	private PaymentType paymentType;
	
	@Column(name="withdraw")
	private double withdraw;
	
	@Column(name="deposit")
	private double deposit;
	
	@Column(name="total")
	private double total;
	
	@Column(name="remark")
	private String remark;
	
	
	public PaymentTransaction(PaymentTransactionDto paymentTransactionDto) {
		
		this.id = paymentTransactionDto.getId();
		this.withdraw = paymentTransactionDto.getWithdraw();
		this.deposit = paymentTransactionDto.getDeposit();
		this.total = paymentTransactionDto.getTotal();
		this.remark = paymentTransactionDto.getRemark();
		
		this.paymentType = new PaymentType(paymentTransactionDto.getPaymentType());
		
		
	}

	
}