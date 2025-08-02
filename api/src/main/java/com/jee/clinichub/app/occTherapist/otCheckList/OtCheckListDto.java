package com.jee.clinichub.app.occTherapist.otCheckList;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.occTherapist.otCategory.OtCategoryDto;
import com.jee.clinichub.app.occTherapist.otSubCategory.OtSubCategoryDto;

import lombok.*;

@Data
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OtCheckListDto {
    
    private Long id;
    @JsonIgnore
    private OtSubCategoryDto subcategory;
    private String name;
	private int year;
	private int month;
	
	
	/* void not accepted
	public void OtCategoryDto(OtCategory category) {
		this.id = category.getId();
		this.name = category.getName();
		
	}
	*/

    public OtCheckListDto(OtCheckList otCheckList) {
    	super();
		this.id = otCheckList.getId();
		if(otCheckList.getSubcategory()!=null){
		//	this.subcategory=new OtSubCategoryDto(otCheckList.getSubcategory());
		}                  
		this.name = otCheckList.getName();
		this.year = otCheckList.getYear();
		this.month = otCheckList.getMonth();
		
	}

	

    
    
}