package com.jee.clinichub.app.occTherapist.otChildrenChecklistMap;

import java.util.Date;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.occTherapist.children.Children;
import com.jee.clinichub.app.occTherapist.children.ChildrenDto;
import com.jee.clinichub.app.occTherapist.otCategory.OtCategoryDto;
import com.jee.clinichub.app.occTherapist.otCheckList.OtCheckList;
import com.jee.clinichub.app.occTherapist.otCheckList.OtCheckListDto;
import com.jee.clinichub.app.occTherapist.otSubCategory.OtSubCategoryDto;

import lombok.*;

@Data
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
//JsonInclude(JsonInclude.Include.NON_NULL)
public class OtChildrenCheckListMapDto {
    
    private Long id;
    private ChildrenDto children;
	private OtCheckListDto checklist;
	private boolean achieved;
	private Date date;
	
	

    public OtChildrenCheckListMapDto(OtChildrenChecklistMap otChildrenChecklistMap) {
    	super();
		this.id = otChildrenChecklistMap.getId();
		if(otChildrenChecklistMap.getChecklist()!=null){
			this.checklist= new OtCheckListDto(otChildrenChecklistMap.getChecklist());
		}                  
		
		this.achieved = otChildrenChecklistMap.isAchieved();
		this.date = otChildrenChecklistMap.getDate();
	}

	

    
    
}