package com.jee.clinichub.app.customer.transaction.model;

import java.util.Date;

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
public class CustomerTxnDto {
	
    private Long id;
 	private CustomerDto customer;
 	private Date txnDate;
 	private Float credit;
	private String remark;
	private Float debit;
	
	
	public CustomerTxnDto(CustomerTxn customerTxn) {
		super();
		if(customerTxn!=null) {
			this.id = customerTxn.getId();
			this.customer =new CustomerDto(customerTxn.getCustomer()) ;
			this.txnDate = customerTxn.getTxnDate();
			this.credit=customerTxn.getCredit();
			this.remark = customerTxn.getRemark();
			this.debit = customerTxn.getDebit();
		}
		
		
	}
}
