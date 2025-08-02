package com.jee.clinichub.app.relationship.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.enquiryService.model.EnquiryServiceTypeDto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})


public class RelationshipDto {
	private Long id;
	
	@NotNull(message = "Name is mandatory")
	@Size(min=3, max=30,message = "Name should between 3 and 30")
    private String name;
	
	public RelationshipDto(Relationship relationship) {
		
         this.id=relationship.getId();
		
		this.name=relationship.getName();	
	}

}
