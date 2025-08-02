package com.jee.clinichub.app.core.country.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

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
public class CountryDto  {
	private Long id;
	
	 @NotNull(message = "Name is mandatory")
		@Size(min=3, max=30,message = "Name should between 3 and 30")
	    private String name;
	 private String code;
	 private String iso;
	 private boolean status;
	 
	 
	 
	 public CountryDto(Country country) {
			this.id=country.getId();
			
			this.name=country.getName();
			
			this.code=country.getCode();
			
			this.iso=country.getIso();
			
			this.status=country.isStatus();
		}

}
