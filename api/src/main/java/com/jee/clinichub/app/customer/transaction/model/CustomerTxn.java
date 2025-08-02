package com.jee.clinichub.app.customer.transaction.model;

import java.io.Serializable;
import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import com.jee.clinichub.app.customer.model.Customer;
import com.jee.clinichub.config.audit.Auditable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "customer_txn")
public class CustomerTxn extends Auditable<String>  implements Serializable{
	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name="customer_id", nullable = false)
	private Customer customer;
	
	@Column(name="txn_date")
	private Date txnDate;
	
	@Column(name="credit")
	private Float credit;
	
	@Column(name="debit")
	private Float debit;
	
	@Column(name="remark")
	private String remark;
	

	
	
	public CustomerTxn(CustomerTxnDto customerTxnDto) {
		super();
		this.id = customerTxnDto.getId();
		this.customer =new Customer(customerTxnDto.getCustomer()) ;
		this.txnDate = customerTxnDto.getTxnDate();
		this.credit=customerTxnDto.getCredit();
		this.debit = customerTxnDto.getDebit();
		this.remark = customerTxnDto.getRemark();
		
		
	}


}
