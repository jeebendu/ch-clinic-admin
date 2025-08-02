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

public class RepairProductinfoDto   implements Serializable {
	

	private static final long serialVersionUID = 1L;
	private Long id;
	private String name;
	private String model;
	private String snLeft;
	private String snRight;

    public RepairProductinfoDto(RepairProductinfo repairProductinfo) {
		if(repairProductinfo!= null){
		this.id = repairProductinfo.getId();
		this.name = repairProductinfo.getName();
		this.model = repairProductinfo.getModel();
		this.snLeft = repairProductinfo.getSnLeft();
		this.snRight = repairProductinfo.getSnRight();
		}

	}



	

	
}
