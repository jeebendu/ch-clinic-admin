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
@Table(name = "repair_fit")
@EntityListeners(AuditingEntityListener.class)
public class RepairFit   implements Serializable {
	

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="is_feedback_fit")
	private boolean isFeedbackFit;

    @Column(name="is_loose")
	private boolean isLoose;

    @Column(name="is_wrongcanal_direction")
	private boolean isWrongcanalDirection;

    @Column(name="is_tight_helix")
	private boolean isTightHelix;

    @Column(name="is_tight_canal")
	private boolean isTightCanal;

    @Column(name="is_tight_allover")
	private boolean isTightAllover;
    
    @Column(name="is_tight_antitragus")
	private boolean isTightAntitragus;
    
    @Column(name="is_canaltoo_long")
	private boolean isCanaltooLong;
    
    @Column(name="is_canaltoo_short")
	private boolean isCanaltooShort;
    
    @Column(name="is_protrudes")
	private boolean isProtrudes;
    
    @Column(name="is_worksoutof_year")
	private boolean isWorksoutofYear;

	public RepairFit( RepairFitDto repairFitDto) {
		if(repairFitDto!=null){
			this.id = repairFitDto.getId();
			this.isFeedbackFit = repairFitDto.isFeedbackFit();
			this.isLoose = repairFitDto.isLoose();
			this.isWrongcanalDirection = repairFitDto.isWrongcanalDirection();
			this.isTightHelix = repairFitDto.isTightHelix();
			this.isTightCanal = repairFitDto.isTightCanal();
			this.isTightAllover = repairFitDto.isTightAllover();
			this.isTightAntitragus = repairFitDto.isTightAntitragus();
			this.isCanaltooLong = repairFitDto.isCanaltooLong();
			this.isCanaltooShort = repairFitDto.isCanaltooShort();
			this.isProtrudes = repairFitDto.isProtrudes();
			this.isWorksoutofYear = repairFitDto.isWorksoutofYear();
	
	
		}
	}
	
	



	

	
}