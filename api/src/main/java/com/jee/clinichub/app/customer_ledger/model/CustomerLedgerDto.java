package com.jee.clinichub.app.customer_ledger.model;

import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;


import com.jee.clinichub.app.customer.model.CustomerDto;

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
public class CustomerLedgerDto {
     private Long id;
	
	
 	private CustomerDto customer;
	
	
 	private String txnDate;
	
	
 	private Float credit;
	
	
 	private Float balance;
	
	
	private Float debit;
	
	private String remark;
	
	
	
	
	public CustomerLedgerDto(CustomerLedger customerLedger) {
		super();
		
		if(customerLedger==null) return;
		
		if(customerLedger.getId()!=null) {
			this.id = customerLedger.getId();
		}
		
		//this.customer =new CustomerDto(customerLedger.getCustomer()) ;
		this.txnDate = customerLedger.getTxnDate();
		this.remark = customerLedger.getRemark();
		this.credit=customerLedger.getCredit();
		this.balance = customerLedger.getBalance();
		this.debit = customerLedger.getDebit();
		
	}
}
