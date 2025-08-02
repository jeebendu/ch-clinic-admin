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

public class RepairFitDto   implements Serializable {
	

	private static final long serialVersionUID = 1L;

	
	private Long id;
	private boolean isFeedbackFit;
	private boolean isLoose;
	private boolean isWrongcanalDirection;
	private boolean isTightHelix;
	private boolean isTightCanal;
	private boolean isTightAllover;
	private boolean isTightAntitragus;
	private boolean isCanaltooLong; 
	private boolean isCanaltooShort;  
	private boolean isProtrudes;
	private boolean isWorksoutofYear;

    
	
	public RepairFitDto(RepairFit repairFit) {
		if(repairFit!=null){
		this.id = repairFit.getId();
		this.isFeedbackFit = repairFit.isFeedbackFit();
		this.isLoose = repairFit.isLoose();
		this.isWrongcanalDirection = repairFit.isWrongcanalDirection();
		this.isTightHelix = repairFit.isTightHelix();
		this.isTightCanal = repairFit.isTightCanal();
		this.isTightAllover = repairFit.isTightAllover();
		this.isTightAntitragus = repairFit.isTightAntitragus();
		this.isCanaltooLong = repairFit.isCanaltooLong();
		this.isCanaltooShort = repairFit.isCanaltooShort();
		this.isProtrudes = repairFit.isProtrudes();
		this.isWorksoutofYear = repairFit.isWorksoutofYear();


		}
	}



	

	
}