package com.jee.clinichub.app.core.sequence.model;

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

import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.core.module.model.Module;
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
@Table(name = "core_sequence")
@EntityListeners(AuditingEntityListener.class)
public class Sequence extends Auditable<String>  implements Serializable {
	

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "branch_id", nullable = false)
	private Branch branch;
	
	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "module_id", nullable = false)
	private Module module;

	
	@Column(name="increment_prefix")
	private String incrementPrefix;
	
	@Column(name="increment_pad_char")
	private char incrementPadChar;
	
	@Column(name="increment_pad_length")
	private Integer incrementPadLength;
	
	@Column(name="increment_last_id")
	private Integer incrementLastId;
	
	@Column(name="increment_last_final")
	private String incrementLastFinal;
	
	@Column(name="include_year")
	private boolean includeYear;
	
	@Column(name="include_branch_code")
	private boolean includeBranchCode;
	

	public Sequence(SequenceDto sequenceDto) {
		super();
		this.id = sequenceDto.getId();
		
		if(sequenceDto.getBranch()!=null)
		this.branch = Branch.fromDto(sequenceDto.getBranch());
		if(sequenceDto.getBranch()!=null)
		this.module = new Module(sequenceDto.getModule());
		this.incrementPrefix = sequenceDto.getIncrementPrefix();
		this.incrementPadChar = sequenceDto.getIncrementPadChar();
		this.incrementPadLength = sequenceDto.getIncrementPadLength();
		this.incrementLastId = sequenceDto.getIncrementLastId();
		this.incrementLastFinal = sequenceDto.getIncrementLastFinal();
		this.includeYear = sequenceDto.isIncludeYear();
		this.includeBranchCode = sequenceDto.isIncludeBranchCode();
		
	}



	public Sequence(Long sequenceId) {
		this.id = sequenceId;
	}

	
}