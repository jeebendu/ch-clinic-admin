package com.jee.clinichub.app.repair.model;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
@Table(name = "repair_defect")
@EntityListeners(AuditingEntityListener.class)
public class RepairDefect   implements Serializable {
	

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="is_crackedshell")
	private boolean isCrackedshell;

    @Column(name="is_holeinshell")
	private boolean isHoleinshell;

    @Column(name="is_brokenbattery")
	private boolean isBrokenbattery;

    @Column(name="is_bdwontclosecompletely")
	private boolean isBdwontclosecompletely;

    @Column(name="is_hingepinbroken")
	private boolean isHingepinbroken;

    @Column(name="is_batterystuckinaid")
	private boolean isBatterystuckinaid;
    
    @Column(name="is_faceplateoff")
	private boolean isFaceplateoff;
    
    @Column(name="is_holeinvent")
	private boolean isHoleinvent;
    
    @Column(name="is_allergyproblem")
	private boolean isAllergyproblem;
    
   

	public RepairDefect( RepairDefectDto repairDefectDto) {
		if(repairDefectDto!= null){
		this.id = repairDefectDto.getId();
		this.isCrackedshell = repairDefectDto.isCrackedshell();
		this.isHoleinshell = repairDefectDto.isHoleinshell();
		this.isBrokenbattery = repairDefectDto.isBrokenbattery();
		this.isBdwontclosecompletely = repairDefectDto.isBdwontclosecompletely();
		this.isHingepinbroken = repairDefectDto.isHingepinbroken();
		this.isBatterystuckinaid = repairDefectDto.isBatterystuckinaid();
		this.isFaceplateoff = repairDefectDto.isFaceplateoff();
		this.isHoleinvent = repairDefectDto.isHoleinvent();
		this.isAllergyproblem = repairDefectDto.isAllergyproblem();
		}
	}
	
	



	

	
}
