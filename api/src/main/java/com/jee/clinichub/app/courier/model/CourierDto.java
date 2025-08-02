package com.jee.clinichub.app.courier.model;

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
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CourierDto {
    
    private Long id;
    
    @NotNull(message = "Name is mandatory")
	@Size(min=3, max=30,message = "Name should between 3 and 30")
    private String name;
	// private String code;
    private String websiteUrl;
    private String apiUrl;
    
	
	public CourierDto(Courier courier) {
		this.id = courier.getId();
		this.name = courier.getName();
		this.websiteUrl = courier.getWebsiteUrl();
		this.apiUrl = courier.getApiUrl();
		
	}
	

    
    
}