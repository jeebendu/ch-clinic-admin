package com.jee.clinichub.app.repair.RepairProblemData.model;

import java.io.Serializable;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
@DynamicUpdate
@Entity
@Table(name = "repair_problem_data")
@EntityListeners(AuditingEntityListener.class)
public class RepairProblemData extends Auditable<String>  implements Serializable{
	
	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="type")
	private String type;
	
	@Column(name="name")
	private String name;
	
	public RepairProblemData(RepairProblemDataDto repairProblemDataDto) {
		super();
		ObjectMapper mapper = new ObjectMapper();
		
		this.id = repairProblemDataDto.getId();
		this.type=repairProblemDataDto.getType();
	    this.name=repairProblemDataDto.getName();
	}

}
