package com.jee.clinichub.app.catalog.type.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Data
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductTypeDto {
    
    private Long id;
    
    @NotNull(message = "Name is mandatory")
	@Size(min=3, max=30,message = "Name should between 3 and 30")
    private String name;
    
    private boolean isStrip;
    
   

	
	public ProductTypeDto(ProductType productType) {
		this.id = productType.getId();
		this.name = productType.getName();
		this.isStrip = productType.isStrip();
	}
	

    
    
}