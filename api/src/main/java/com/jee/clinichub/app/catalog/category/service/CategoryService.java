package com.jee.clinichub.app.catalog.category.service;

import java.util.List;

import com.jee.clinichub.app.catalog.category.model.Category;
import com.jee.clinichub.app.catalog.category.model.CategoryDto;
import com.jee.clinichub.global.model.Status;

public interface CategoryService {
	
    Category findByName(String name);

    CategoryDto getById(Long id);

	Status deleteById(Long id);

	Status saveOrUpdate(CategoryDto Category);

	List<CategoryDto> getAllCategorys();
}
