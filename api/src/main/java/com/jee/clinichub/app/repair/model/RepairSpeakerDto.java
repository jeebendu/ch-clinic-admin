package com.jee.clinichub.app.repair.model;

import java.io.Serializable;

import jakarta.persistence.Column;
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

public class RepairSpeakerDto  implements Serializable {
	

	private static final long serialVersionUID = 1L;

	private Long id;

	
	private String size;
	private boolean isLeft;
	private boolean isRight;
	private String serialLeft;
	private String serialRight;
	private String modelLeft;
	private String modelRight;

	public RepairSpeakerDto(RepairSpeaker repairSpeaker) {
		if (repairSpeaker!=null){
			this.id = repairSpeaker.getId();
			this.size = repairSpeaker.getSize();
			this.isLeft = repairSpeaker.isLeft();
			this.isRight = repairSpeaker.isRight();
			this.serialLeft = repairSpeaker.getSerialLeft();
			this.serialRight = repairSpeaker.getSerialRight();
			this.modelLeft = repairSpeaker.getModelLeft();
			this.modelRight = repairSpeaker.getModelRight();
		}
		
	
	}



	

	
}

