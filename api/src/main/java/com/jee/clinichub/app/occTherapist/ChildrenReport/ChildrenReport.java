package com.jee.clinichub.app.occTherapist.ChildrenReport;

import java.util.Date;
import java.util.List;

import com.jee.clinichub.app.occTherapist.children.ChildrenDto;
import com.jee.clinichub.app.occTherapist.otCategory.OtCategoryDto;
import com.jee.clinichub.app.occTherapist.otCheckList.OtCheckListDto;
import com.jee.clinichub.app.occTherapist.otChildrenChecklistMap.OtChildrenCheckListMapDto;

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
public class ChildrenReport {

	
	 private ChildrenDto children;
	 private List<OtCategoryDto> categoryList;
}
