package com.jee.clinichub.app.core.module.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.branch.model.BranchDto;

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
public class ModuleDto {
    
	private Long id;
	private String name;
    private String code;
	
	public ModuleDto(Module module) {
		this.id = module.getId();
		this.name=module.getName();
		this.code=module.getCode();
	}
	

    
    
}