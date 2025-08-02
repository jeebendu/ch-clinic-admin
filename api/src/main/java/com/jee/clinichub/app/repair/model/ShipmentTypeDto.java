package com.jee.clinichub.app.repair.model;

import java.io.Serializable;


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

public class ShipmentTypeDto  implements Serializable {
	

	private static final long serialVersionUID = 1L;

	
	private Long id;
	private String type;
	
    public ShipmentTypeDto(ShipmentType shipmentType) {
		this.id = shipmentType.getId();
		this.type = shipmentType.getType();
	
	}

}

