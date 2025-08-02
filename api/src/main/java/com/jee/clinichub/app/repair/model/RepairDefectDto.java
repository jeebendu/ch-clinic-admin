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

public class RepairDefectDto   implements Serializable {
	

	private static final long serialVersionUID = 1L;

	
	private Long id;
	private boolean isCrackedshell;
	private boolean isHoleinshell;
    private boolean isBrokenbattery;
	private boolean isBdwontclosecompletely;
	private boolean isHingepinbroken;
	private boolean isBatterystuckinaid;
	private boolean isFaceplateoff;
	private boolean isHoleinvent;
	private boolean isAllergyproblem;
    
   

	public RepairDefectDto(RepairDefect repairDefect) {
		if(repairDefect!= null){
		this.id = repairDefect.getId();
		this.isCrackedshell = repairDefect.isCrackedshell();
		this.isHoleinshell = repairDefect.isHoleinshell();
		this.isBrokenbattery = repairDefect.isBrokenbattery();
		this.isBdwontclosecompletely = repairDefect.isBdwontclosecompletely();
		this.isHingepinbroken = repairDefect.isHingepinbroken();
		this.isBatterystuckinaid = repairDefect.isBatterystuckinaid();
		this.isFaceplateoff = repairDefect.isFaceplateoff();
		this.isHoleinvent = repairDefect.isHoleinvent();
		this.isAllergyproblem = repairDefect.isAllergyproblem();
	
	}
}
	



	

	
}
