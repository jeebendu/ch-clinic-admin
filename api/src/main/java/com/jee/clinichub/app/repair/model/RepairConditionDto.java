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

public class RepairConditionDto   implements Serializable {
	

	private static final long serialVersionUID = 1L;

	
	private Long id;
	private boolean isDead;
	private boolean isVcbroken;
	private boolean isWheeloffvc;
	private boolean isLoosevc;
	private boolean isTightvc;
	private boolean isPoortapervc;
	private boolean isVcintermittent;
	private boolean isInternalfeedback;
	private boolean isBrokenswitch;
	private boolean isDamagedcrosscord;
	private boolean isDeadtelecoil;
	private boolean isPutpushedin;
	private boolean isPluggedwithwax;
	private boolean isWaterdamaged;
	private boolean isFades;
	private boolean isAccessorymissing;
	private boolean isRemoveaccessory;
	private boolean isReceiverpushedin;
	private boolean isTransducersealloose;
	private boolean isTransducerbroken;

	

 
	public RepairConditionDto(RepairCondition repairCondition) {
		this.id = repairCondition.getId();
		this.isDead = repairCondition.isDead();
		this.isVcbroken = repairCondition.isVcbroken();
		this.isWheeloffvc = repairCondition.isWheeloffvc();
		this.isLoosevc = repairCondition.isLoosevc();
		this.isTightvc= repairCondition.isTightvc();
		this.isPoortapervc= repairCondition.isPoortapervc();
		this.isVcintermittent= repairCondition.isVcintermittent();
		this.isInternalfeedback= repairCondition.isInternalfeedback();
		this.isBrokenswitch= repairCondition.isBrokenswitch();
		this.isDamagedcrosscord= repairCondition.isDamagedcrosscord();
		this.isDeadtelecoil= repairCondition.isDeadtelecoil();
		this.isPutpushedin= repairCondition.isPutpushedin();
		this.isPluggedwithwax= repairCondition.isPluggedwithwax();
		this.isWaterdamaged= repairCondition.isWaterdamaged();
		this.isFades= repairCondition.isFades();
		this.isAccessorymissing= repairCondition.isAccessorymissing();
		this.isRemoveaccessory= repairCondition.isRemoveaccessory();
		this.isReceiverpushedin= repairCondition.isReceiverpushedin();
		this.isTransducersealloose= repairCondition.isTransducersealloose();
		this.isTransducerbroken = repairCondition.isTransducerbroken();
		
	}


	

	
}
