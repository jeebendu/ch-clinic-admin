package com.jee.clinichub.app.customer_ledger.model;

import java.io.Serializable;

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

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "customer_ledger")
public class CustomerLedger   implements Serializable{
	private static final long serialVersionUID = 1L;

	@Id
    //@GeneratedValue(strategy= GenerationType.IDENTITY)
	@Column(name="id")
	private Long id;
	
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="customer_id", nullable = false)
	private Customer customer;
	
	@Column(name="txn_date")
	private String txnDate;
	
	@Column(name="credit")
	private Float credit;
	
	@Column(name="debit")
	private Float debit;
	
	@Column(name="balance")
	private Float balance;
	
	@Column(name="remark")
	private String remark;

	
	public CustomerLedger(CustomerLedgerDto customerLedgerDto) {
		super();
		this.id = customerLedgerDto.getId();
		this.customer =new Customer(customerLedgerDto.getCustomer()) ;
		this.txnDate = customerLedgerDto.getTxnDate();
		this.remark = customerLedgerDto.getRemark();
		this.credit=customerLedgerDto.getCredit();
		this.debit = customerLedgerDto.getDebit();
		this.balance = customerLedgerDto.getBalance();
		
		
	}
}
