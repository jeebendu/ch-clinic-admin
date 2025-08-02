package com.jee.clinichub.app.occTherapist.otCategory;

import java.util.List;

import jakarta.validation.Valid;

import com.jee.clinichub.global.model.Status;

public interface OtCategoryService {

	OtCategoryDto getById(Long id);

	List<OtCategoryDto> getAllOtCategorys();

	

	

}