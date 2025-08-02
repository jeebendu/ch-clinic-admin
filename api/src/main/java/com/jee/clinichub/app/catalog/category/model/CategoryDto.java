package com.jee.clinichub.app.catalog.category.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

@Data
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CategoryDto {
    
    private Long id;
    
    @NotNull(message = "Name is mandatory")
	@Size(min=3, max=30,message = "Name should between 3 and 30")
    private String name;
    
    @JsonCreator
    public CategoryDto(@JsonProperty("name") String name) {
        this.name = name;
    }
    
	
	public CategoryDto(Category category) {
		this.id = category.getId();
		this.name = category.getName();
		
	}
	

    
    
}