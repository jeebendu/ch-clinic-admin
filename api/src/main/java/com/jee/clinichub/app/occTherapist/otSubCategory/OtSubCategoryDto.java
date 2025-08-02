package com.jee.clinichub.app.occTherapist.otSubCategory;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.occTherapist.otCategory.OtCategoryDto;

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
public class OtSubCategoryDto {
    
    private Long id;
    @JsonIgnore
    private OtCategoryDto category;
    private String name;
    private String timeline;
    
	
	/* void not accepted
	public void OtCategoryDto(OtCategory category) {
		this.id = category.getId();
		this.name = category.getName();
		
	}
	*/

    public OtSubCategoryDto(OtSubCategory otSubCategory) {
    	super();
		this.id = otSubCategory.getId();
		
		this.name = otSubCategory.getName();
	}

	

    
    
}