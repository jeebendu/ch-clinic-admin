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

public class RepairResponseDto   implements Serializable {
	

	private static final long serialVersionUID = 1L;

	private Long id;
	private boolean isNoutput;
	private boolean isWeak;
	private boolean isDistorted;
	private boolean isNoisy;
	private boolean isTinny;
	private boolean isToostrong;
	private boolean isTooweak;
	private boolean isOccludes;
	private boolean isCircuitnoise;
	private boolean isStaticnoise;
	private boolean isBooming;
	private boolean isOthers;



	public RepairResponseDto ( RepairResponse repairResponse) {
		if(repairResponse!= null){
		this.id = repairResponse.getId();
		this.isNoutput = repairResponse.isNoutput();
		this.isWeak = repairResponse.isWeak();
		this.isDistorted = repairResponse.isDistorted();
		this. isNoisy= repairResponse.isNoisy();
		this.isTinny = repairResponse.isTinny();
		this.isToostrong = repairResponse.isToostrong();
		this.isTooweak = repairResponse.isTooweak();
		this.isOccludes = repairResponse.isOccludes();
		this.isCircuitnoise = repairResponse.isCircuitnoise();
		this.isStaticnoise = repairResponse.isStaticnoise();
		this. isBooming= repairResponse.isBooming();
		this. isOthers= repairResponse.isOthers();
		}
	}
	



	

	
}
