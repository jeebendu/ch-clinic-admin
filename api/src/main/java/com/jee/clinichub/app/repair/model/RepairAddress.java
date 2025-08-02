package com.jee.clinichub.app.repair.model;

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
@Table(name = "repair_address")
@EntityListeners(AuditingEntityListener.class)
public class RepairAddress   implements Serializable {
	

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;

	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "address_type_id", nullable = false)
	private AddressType addressType;

	
	@Column(name="name")
	private String name;
	
	@Column(name="address")
	private String address;
	
	@Column(name="city")
	private String city;

    @Column(name="state")
	private String state;
    
    @Column(name="pin")
   	private String pin;
    
    @Column(name="email")
   	private String email;
    
    @Column(name="phone")
   	private String phone;


    public static long getSerialversionuid() {
        return serialVersionUID;
    }

	public RepairAddress(RepairAddressDto repairAddressDto,String type) {
		this.id = repairAddressDto.getId();
		this.name = repairAddressDto.getName();
		//this.addressType = repairAddressDto.getAddressType();
		this.address = repairAddressDto.getAddress();
		this.city = repairAddressDto.getCity();
		this.state = repairAddressDto.getState();
		this.pin = repairAddressDto.getPin();
		this.email = repairAddressDto.getEmail();
		this.phone = repairAddressDto.getPhone();
		
		if(type.equalsIgnoreCase("billing")) {
			this.addressType = new AddressType(1L);
		}else {
			this.addressType = new AddressType(2L);
		}
	}
	public RepairAddress(RepairAddressDto repairAddressDto) {
		this.id = repairAddressDto.getId();
		this.name = repairAddressDto.getName();
		this.addressType =new AddressType( repairAddressDto.getAddressType());
		this.address = repairAddressDto.getAddress();
		this.city = repairAddressDto.getCity();
		this.state = repairAddressDto.getState();
		this.pin = repairAddressDto.getPin();
		this.email = repairAddressDto.getEmail();
		this.phone = repairAddressDto.getPhone();
		
		
	}

	

	
}

