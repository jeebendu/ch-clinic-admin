package com.jee.clinichub.app.occTherapist.otCheckList;

import java.util.List;

import jakarta.validation.Valid;

import com.jee.clinichub.global.model.Status;

public interface OtCheckListService {


	List<OtCheckListDto> getAllOtCheckList();

	OtCheckListDto getById(Long id);

	List<OtCheckListDto> getAllOtCheckLists();

	List<OtCheckListDto> getBySubCategoryId(Long id);

	

	

}