package com.jee.clinichub.app.repair.model;

import java.io.Serializable;
import java.util.Date;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.jee.clinichub.app.payment.type.model.PaymentType;
import com.jee.clinichub.global.utility.DateUtility;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "repair_payment")
@EntityListeners(AuditingEntityListener.class)
public class RepairPayment  implements Serializable {
	

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;

	@JsonBackReference
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "repair_id")
	private Repair repair;	
	
	 @OneToOne(fetch = FetchType.EAGER,cascade = CascadeType.ALL)
	 @JoinColumn(name = "repair_status_id", nullable = true) 
	private RepairStatus repairStatus;	
	
	 @OneToOne(fetch = FetchType.EAGER)
	 @JoinColumn(name = "payment_type_id", nullable = true)
	private PaymentType paymentType;	

	@Column(name="date")
	private Date date;	
	
	@Column(name="amount")
	private double amount;
	
   

	public RepairPayment(RepairPaymentDto repairPaymentDto) {
	if(repairPaymentDto!= null){
		this.id = repairPaymentDto.getId();
		//this.repair=new Repair (repairPaymentDto.getRep);
		this.repairStatus=new RepairStatus (repairPaymentDto.getRepairStatus());
		this.paymentType=new PaymentType (repairPaymentDto.getPaymentType());
		this.date =repairPaymentDto.getDate();
		this.amount = repairPaymentDto.getAmount();
       


	}
	}

	

	
}

