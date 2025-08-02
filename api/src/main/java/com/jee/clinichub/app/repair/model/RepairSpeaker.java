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
@Table(name = "repair_speaker")
@EntityListeners(AuditingEntityListener.class)
public class RepairSpeaker  implements Serializable {
	

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;

	@Column(name="size")
	private String size;
	
	@Column(name="is_left")
	private boolean isLeft;
	
	@Column(name="is_right")
	private boolean isRight;

    @Column(name="serial_left")
	private String serialLeft;
    
    @Column(name="serial_right")
	private String serialRight;

	@Column(name="model_left")
	private String modelLeft;
	
	@Column(name="model_right")
	private String modelRight;

    
	public RepairSpeaker( RepairSpeakerDto repairSpeakerDto) {
		if(repairSpeakerDto!= null){
		this.id = repairSpeakerDto.getId();
		this.size = repairSpeakerDto.getSize();
		this.isLeft = repairSpeakerDto.isLeft();
		this.isRight = repairSpeakerDto.isRight();
		this.serialLeft = repairSpeakerDto.getSerialLeft();
		this.serialRight = repairSpeakerDto.getSerialRight();
		this.modelLeft = repairSpeakerDto.getModelLeft();
		this.modelRight = repairSpeakerDto.getModelRight();
		}
	}



	

	
}

