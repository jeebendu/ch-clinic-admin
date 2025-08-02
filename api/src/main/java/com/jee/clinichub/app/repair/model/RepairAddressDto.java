package com.jee.clinichub.app.repair.model;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

import org.hibernate.annotations.DynamicUpdate;


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

public class RepairAddressDto   implements Serializable {
	

	private static final long serialVersionUID = 1L;

	
	private Long id;

	private AddressTypeDto addressType;

	
	
	private String name;
	
	
	private String address;
	
	
	private String city;

    
	private String state;
    
  
   	private String pin;
    
   
   	private String email;
    
  
   	private String phone;


	public RepairAddressDto(RepairAddress repairAddress) {
		if(repairAddress!=null) {
			this.id = repairAddress.getId();
			this.name = repairAddress.getName();
			this.addressType =new AddressTypeDto(repairAddress.getAddressType()) ;
			this.address = repairAddress.getAddress();
			this.city = repairAddress.getCity();
			this.state = repairAddress.getState();
			this.pin = repairAddress.getPin();
			this.email = repairAddress.getEmail();
			this.phone = repairAddress.getPhone();
		}
		
	}


	

	
}

