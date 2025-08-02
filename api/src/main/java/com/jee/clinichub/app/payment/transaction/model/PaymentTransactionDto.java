package com.jee.clinichub.app.payment.transaction.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.payment.type.model.PaymentTypeDto;

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
public class PaymentTransactionDto {
    
    private Long id;
	private BranchDto branch;
	private PaymentTypeDto paymentType;
	private double withdraw;
	private double deposit;
	private double total;
	private String remark;
	
   

	
	public PaymentTransactionDto(PaymentTransaction paymentTransaction) {
		this.id = paymentTransaction.getId();
		
		this.withdraw = paymentTransaction.getWithdraw();
		this.deposit = paymentTransaction.getDeposit();
		this.total = paymentTransaction.getTotal();
		this.remark = paymentTransaction.getRemark();
		
		if(paymentTransaction.getBranch()!=null){
			this.branch=new BranchDto(paymentTransaction.getBranch());
		}
		// if(paymentTransaction.getPaymentType()!=null){
		// 	this.paymentType=new PaymentTypeDto(paymentTransaction.getPaymentType());
		// }
		this.paymentType = new PaymentTypeDto(paymentTransaction.getPaymentType());
	}
	

    
    
}