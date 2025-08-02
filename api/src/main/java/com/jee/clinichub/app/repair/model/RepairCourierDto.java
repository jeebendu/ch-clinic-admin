package com.jee.clinichub.app.repair.model;

import java.io.Serializable;
import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.jee.clinichub.app.courier.model.CourierDto;
import com.jee.clinichub.app.payment.type.model.PaymentTypeDto;
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

public class RepairCourierDto   implements Serializable {
	

	private static final long serialVersionUID = 1L;
	
	private Long id;
	
	private RepairStatusDto repairStatus;
	private CourierDto courier;
	private AddressTypeDto shipmentType;
	private double amount;
	private Date sendDate;
	private String sendBy;
	private Date recievedDate;
	private String recievedBy;
	private String trackNo;
	private double cost;
	
    public static long getSerialversionuid() {
        return serialVersionUID;
    }

	public RepairCourierDto(RepairCourier repairCourier) {
	if(repairCourier!= null){
		this.id = repairCourier.getId();
		
		this.repairStatus= new RepairStatusDto(repairCourier.getRepairStatus());
		this.courier= new CourierDto(repairCourier.getCourier());
		this.shipmentType= new AddressTypeDto(repairCourier.getShipmentType());
		this.amount = repairCourier.getAmount();
		this.sendDate = repairCourier.getSendDate();
		this.sendBy = repairCourier.getSendBy();
		this.recievedDate = repairCourier.getRecievedDate();
		this.recievedBy = repairCourier.getRecievedBy();
		this.trackNo = repairCourier.getTrackNo();
		this.cost = repairCourier.getCost();
	}
	}

	

	
}

