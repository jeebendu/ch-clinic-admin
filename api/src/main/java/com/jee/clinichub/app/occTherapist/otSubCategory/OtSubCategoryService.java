package com.jee.clinichub.app.occTherapist.otSubCategory;

import java.util.List;

import jakarta.validation.Valid;

import com.jee.clinichub.global.model.Status;

public interface OtSubCategoryService {


	List<OtSubCategoryDto> getAllOtSubCategorys();

	OtSubCategoryDto getById(Long id);

	List<OtSubCategoryDto> getByCategoryId(Long id);

	

	

}