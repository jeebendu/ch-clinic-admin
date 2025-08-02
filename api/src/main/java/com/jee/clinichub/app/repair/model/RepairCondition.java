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
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.payment.type.model.PaymentType;
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
@Table(name = "repair_condition")
@EntityListeners(AuditingEntityListener.class)
public class RepairCondition   implements Serializable {
	

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="is_dead")
	private boolean isDead;
	@Column(name="is_vcbroken")
	private boolean isVcbroken;
	@Column(name="is_wheeloffvc")
	private boolean isWheeloffvc;
	@Column(name="is_loosevc")
	private boolean isLoosevc;
	@Column(name="is_tightvc")
	private boolean isTightvc;
	@Column(name="is_poortapervc")
	private boolean isPoortapervc;
	@Column(name="is_vcintermittent")
	private boolean isVcintermittent;
	@Column(name="is_internalfeedback")
	private boolean isInternalfeedback;
	@Column(name="is_brokenswitch")
	private boolean isBrokenswitch;
	@Column(name="is_damagedcrosscord")
	private boolean isDamagedcrosscord;
	@Column(name="is_deadtelecoil")
	private boolean isDeadtelecoil;
	@Column(name="is_putpushedin")
	private boolean isPutpushedin;
	@Column(name="is_pluggedwithwax")
	private boolean isPluggedwithwax;
	@Column(name="is_waterdamaged")
	private boolean isWaterdamaged;
	@Column(name="is_fades")
	private boolean isFades;
	@Column(name="is_accessorymissing")
	private boolean isAccessorymissing;
	@Column(name="is_removeaccessory")
	private boolean isRemoveaccessory;
	@Column(name="is_receiverpushedin")
	private boolean isReceiverpushedin;
	@Column(name="is_transducersealloose")
	private boolean isTransducersealloose;
	@Column(name="is_transducerbroken")
	private boolean isTransducerbroken;

    
	public RepairCondition(RepairConditionDto repairConditionDto) {
		if(repairConditionDto!= null){
		this.id = repairConditionDto.getId();
		this.isDead = repairConditionDto.isDead();
		this.isVcbroken = repairConditionDto.isVcbroken();
		this.isWheeloffvc = repairConditionDto.isWheeloffvc();
		this.isLoosevc = repairConditionDto.isLoosevc();
		this.isTightvc= repairConditionDto.isTightvc();
		this.isPoortapervc= repairConditionDto.isPoortapervc();
		this.isVcintermittent= repairConditionDto.isVcintermittent();
		this.isInternalfeedback= repairConditionDto.isInternalfeedback();
		this.isBrokenswitch= repairConditionDto.isBrokenswitch();
		this.isDamagedcrosscord= repairConditionDto.isDamagedcrosscord();
		this.isDeadtelecoil= repairConditionDto.isDeadtelecoil();
		this.isPutpushedin= repairConditionDto.isPutpushedin();
		this.isPluggedwithwax= repairConditionDto.isPluggedwithwax();
		this.isWaterdamaged= repairConditionDto.isWaterdamaged();
		this.isFades= repairConditionDto.isFades();
		this.isAccessorymissing= repairConditionDto.isAccessorymissing();
		this.isRemoveaccessory= repairConditionDto.isRemoveaccessory();
		this.isReceiverpushedin= repairConditionDto.isReceiverpushedin();
		this.isTransducersealloose= repairConditionDto.isTransducersealloose();
		this.isTransducerbroken = repairConditionDto.isTransducerbroken();
		

	}
	}
	
	

	
}
