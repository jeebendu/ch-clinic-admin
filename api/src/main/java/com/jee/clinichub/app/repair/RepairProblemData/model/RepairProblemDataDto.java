package com.jee.clinichub.app.repair.RepairProblemData.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.patient.audiometry.model.AudiometryDto;

import com.jee.clinichub.config.audit.AuditableDto;

import jakarta.persistence.Column;
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
public class RepairProblemDataDto extends AuditableDto<String>{
	
	private Long id;
	
	
	private String type;
	
	private String name;

	private boolean status;
	
	public RepairProblemDataDto(RepairProblemData repairProblemData) {
		ObjectMapper om = new ObjectMapper();
		
		this.id = repairProblemData.getId();
		this.type=repairProblemData.getType();
		
		this.name=repairProblemData.getName();
		
		
	}

}

@Data
class DataMap {
	private String key;
	private String value;

	
}
