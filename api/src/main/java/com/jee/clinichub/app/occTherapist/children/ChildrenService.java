package com.jee.clinichub.app.occTherapist.children;

import java.util.List;

import jakarta.validation.Valid;

import com.jee.clinichub.app.occTherapist.ChildrenReport.ChildrenReport;
import com.jee.clinichub.app.occTherapist.otCategory.OtCategoryDto;
import com.jee.clinichub.global.model.Status;

public interface ChildrenService {

	ChildrenDto getById(Long id);

	List<ChildrenDto> getAllChildrens();

	Status saveOrUpdate(@Valid ChildrenDto children);

	Status deleteById(Long id);

	ChildrenDto getByChildrenMapping(Long childrenId, Long subcatId);

	

	Status saveByChildrenMapping(@Valid ChildrenDto children);

	Status saveChildrenSummary(@Valid ChildrenDto children);

	ChildrenReport getCategory(Long id);

	

}
