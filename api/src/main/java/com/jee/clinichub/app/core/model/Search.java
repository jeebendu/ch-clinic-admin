package com.jee.clinichub.app.core.model;

import java.util.List;

import com.jee.clinichub.app.catalog.brand.model.BrandDto;
import com.jee.clinichub.app.catalog.category.model.CategoryDto;
import com.jee.clinichub.app.catalog.type.model.ProductTypeDto;
import com.jee.clinichub.app.doctor.specialization.model.Specialization;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Search {

	public String name;
	
	private CategoryDto category;
	
	private BrandDto brand;
	
	private ProductTypeDto type;
	
	public Integer available;
	
	public Integer expiry;

	private List<Specialization> specializations;
	
}
