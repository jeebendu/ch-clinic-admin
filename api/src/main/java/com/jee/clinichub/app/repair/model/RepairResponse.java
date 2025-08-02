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
@Table(name = "repair_response")
@EntityListeners(AuditingEntityListener.class)
public class RepairResponse   implements Serializable {
	

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="is_noutput")
	private boolean isNoutput;

    @Column(name="is_weak")
	private boolean isWeak;

    @Column(name="is_distorted")
	private boolean isDistorted;

    @Column(name="is_noisy")
	private boolean isNoisy;

    @Column(name="is_tinny")
	private boolean isTinny;

    @Column(name="is_toostrong")
	private boolean isToostrong;
    
    @Column(name="is_tooweak")
	private boolean isTooweak;
    
    @Column(name="is_occludes")
	private boolean isOccludes;
    
    @Column(name="is_circuitnoise")
	private boolean isCircuitnoise;
    
    @Column(name="is_staticnoise")
	private boolean isStaticnoise;
    
    @Column(name="is_booming")
	private boolean isBooming;

	@Column(name="is_others")
	private boolean isOthers;

    public RepairResponse( RepairResponseDto repairResponseDto) {
		if(repairResponseDto!= null){
		this.id = repairResponseDto.getId();
		this.isNoutput = repairResponseDto.isNoutput();
		this.isWeak = repairResponseDto.isWeak();
		this.isDistorted = repairResponseDto.isDistorted();
		this. isNoisy= repairResponseDto.isNoisy();
		this.isTinny = repairResponseDto.isTinny();
		this.isToostrong = repairResponseDto.isToostrong();
		this.isTooweak = repairResponseDto.isTooweak();
		this.isOccludes = repairResponseDto.isOccludes();
		this.isCircuitnoise = repairResponseDto.isCircuitnoise();
		this.isStaticnoise = repairResponseDto.isStaticnoise();
		this. isBooming= repairResponseDto.isBooming();
		this. isOthers= repairResponseDto.isOthers();
		}
	}
	
	



	

	
}
