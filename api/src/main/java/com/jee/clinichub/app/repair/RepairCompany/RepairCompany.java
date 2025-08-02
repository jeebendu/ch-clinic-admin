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
@DynamicUpdate
@Entity
@Table(name = "repair_company")
@EntityListeners(AuditingEntityListener.class)
public class RepairCompany {
   
    
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;

	@Column(name="name")
	private String name;

    @Column(name="bill_address")
	private String billAddress;

    @Column(name="bill_city")
	private String billCity;

    @Column(name="bill_state")
	private String billState;

    @Column(name="bill_pin")
	private String billPin;
    
    @Column(name="bill_phone")
	private String billPhone;

    @Column(name="bill_email")
	private String billEmail;


    @Column(name="ship_address")
	private String shipAddress;

    @Column(name="ship_city")
	private String shipCity;

    @Column(name="ship_state")
	private String shipState;
    
    @Column(name="ship_pin")
	private String shipPin;
    
    @Column(name="ship_phone")
	private String shipPhone;

    @Column(name="ship_email")
	private String shipEmail;


	public RepairCompany(RepairCompanyDto repairCompany) {
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
