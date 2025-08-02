package com.jee.clinichub.app.repair.RepairCompany;

import org.hibernate.annotations.DynamicUpdate;

import java.io.Serializable;

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

import com.jee.clinichub.config.audit.Auditable;

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
public class RepairCompanyDto {
   
    
   
	private Long id;

	
	private String name;
	private String billAddress;
	private String billCity;
	private String billState;
	private String billPin;
	private String billPhone;
	private String billEmail;
	private String shipAddress;
	private String shipCity;
	private String shipState;
	private String shipPin;
	private String shipPhone;
	private String shipEmail;

	public RepairCompanyDto(RepairCompany repairCompany) {
		this.id = repairCompany.getId();
		this.name = repairCompany.getName();
		this.billAddress = repairCompany.getBillAddress();
		this.billCity = repairCompany.getBillCity();
		this.billState = repairCompany.getBillState();
		this.billPin= repairCompany.getBillPin();
		this.billPhone= repairCompany.getBillPhone();
		this.billEmail= repairCompany.getBillEmail();
		this.shipAddress = repairCompany.getShipAddress();
		this.shipCity = repairCompany.getShipCity();
		this.shipState = repairCompany.getShipState();
		this.shipPin = repairCompany.getShipPin();
		this.shipPhone = repairCompany.getShipPhone();
		this.shipEmail = repairCompany.getShipEmail();
		
	}

}
