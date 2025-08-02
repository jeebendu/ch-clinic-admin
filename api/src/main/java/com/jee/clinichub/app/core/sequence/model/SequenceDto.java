package com.jee.clinichub.app.core.sequence.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.core.module.model.ModuleDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SequenceDto {
    
	private Long id;
	private BranchDto branch;
	private ModuleDto module;
	private String incrementPrefix;
	private char incrementPadChar;
	private Integer incrementPadLength;
	private Integer incrementLastId;
	private String incrementLastFinal;
	private boolean isIncludeYear;
	private boolean isIncludeBranchCode;
    
	
	public SequenceDto(Sequence sequence) {
		this.id = sequence.getId();
		this.branch = new BranchDto(sequence.getBranch());
		this.module = new ModuleDto(sequence.getModule());
		this.incrementPrefix = sequence.getIncrementPrefix();
		this.incrementPadChar = sequence.getIncrementPadChar();
		this.incrementPadLength = sequence.getIncrementPadLength();
		this.incrementLastId = sequence.getIncrementLastId();
		this.incrementLastFinal = sequence.getIncrementLastFinal();
		this.isIncludeYear = sequence.isIncludeYear();
		this.isIncludeBranchCode = sequence.isIncludeBranchCode();
	}
	

    
    
}