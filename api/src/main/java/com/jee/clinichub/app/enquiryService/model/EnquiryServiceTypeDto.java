package com.jee.clinichub.app.enquiryService.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.branch.model.RevisionMetadataDto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
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
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })

public class EnquiryServiceTypeDto {
	private Long id;

	@NotNull(message = "Name is mandatory")
	@Size(min = 3, max = 100, message = "Name should between 3 and 100")
	private String name;
	
	private Long count;

	private java.util.UUID globalId;


	public EnquiryServiceTypeDto(EnquiryServiceType enquiryServiceType) {
		this.id = enquiryServiceType.getId();
		this.name = enquiryServiceType.getName();
		this.globalId=enquiryServiceType.getGlobalId();
	}

}
