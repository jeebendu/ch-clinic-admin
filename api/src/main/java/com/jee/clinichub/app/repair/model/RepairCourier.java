package com.jee.clinichub.app.repair.model;

import java.io.Serializable;
import java.util.Date;

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

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.jee.clinichub.app.courier.model.Courier;
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
@Table(name = "repair_courier")
@EntityListeners(AuditingEntityListener.class)
public class RepairCourier  implements Serializable {
	

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
	 @JoinColumn(name = "courier_id", nullable = true) 
	private Courier courier;	
	
	
	@OneToOne
	@JoinColumn(name="shipment_type_id")
	private AddressType shipmentType;
	 
	@Column(name="amount")
	private double amount;
	
	@Column(name="send_date")
	private Date sendDate;
	
	@Column(name="send_by")
	private String sendBy;
	
	@Column(name="recieved_date")
	private Date recievedDate;
	
	@Column(name="recieved_by")
	private String recievedBy;
	
	@Column(name="track_no")
	private String trackNo;
	
	@Column(name="cost")
	private double cost;
	
    public static long getSerialversionuid() {
        return serialVersionUID;
    }

	public RepairCourier(RepairCourierDto repairCourierDto) {
	if(repairCourierDto!= null){
		this.id = repairCourierDto.getId();
		//this.repair=new Repair (repairPaymentDto.getRep);
		this.repairStatus=new RepairStatus (repairCourierDto.getRepairStatus());
		this.courier=new Courier (repairCourierDto.getCourier());
		this.shipmentType=new AddressType(repairCourierDto.getShipmentType());
		this.amount = repairCourierDto.getAmount();
		this.sendDate = repairCourierDto.getSendDate();
		this.sendBy = repairCourierDto.getSendBy();
		this.recievedDate = repairCourierDto.getRecievedDate();
		this.recievedBy = repairCourierDto.getRecievedBy();
		this.trackNo = repairCourierDto.getTrackNo();
		this.cost = repairCourierDto.getCost();
		

	}
	}

	

	
}

