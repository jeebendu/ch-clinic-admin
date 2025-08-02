package com.jee.clinichub.app.repair.model;

import java.io.Serializable;
import java.util.Date;

import org.hibernate.annotations.DynamicUpdate;

import com.jee.clinichub.app.payment.type.model.PaymentTypeDto;
import com.jee.clinichub.global.utility.DateUtility;

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

public class RepairPaymentDto   implements Serializable {
	

	private static final long serialVersionUID = 1L;


	private Long id;
	
	private RepairStatusDto repairStatus;
	private PaymentTypeDto paymentType;	
	private Date date;
	private double amount;
	
 

	public RepairPaymentDto(RepairPayment repairPayment) {
	if(repairPayment!= null){
		this.id = repairPayment.getId();
		
		this.repairStatus= new RepairStatusDto(repairPayment.getRepairStatus());
		
		this.paymentType=new PaymentTypeDto(repairPayment.getPaymentType());
		this.date =  repairPayment.getDate();
		this.amount = repairPayment.getAmount();

	}
	}

	

	
}

