package com.jee.clinichub.app.occTherapist.otCategory;

import java.util.List;
import java.util.stream.Collectors;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.occTherapist.otSubCategory.OtSubCategoryDto;

import lombok.*;

@Data
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OtCategoryDto {
    
    private Long id;
    
    private String name;
    private String timeline;
    private List<OtSubCategoryDto> subCategoryDtoList;
	
	/* void not accepted
	public void OtCategoryDto(OtCategory category) {
		this.id = category.getId();
		this.name = category.getName();
		
	}
	*/

    public OtCategoryDto(OtCategory otCategory) {
    	super();
		this.id = otCategory.getId();
		this.name = otCategory.getName();
		this.subCategoryDtoList = otCategory.getOtSubCategorys().stream().map(OtSubCategoryDto::new).collect(Collectors.toList());
	}

	

    
    
}