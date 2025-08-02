package com.jee.clinichub.app.catalog.product.model;

import com.jee.clinichub.app.catalog.brand.model.BrandDto;
import com.jee.clinichub.app.catalog.category.model.CategoryDto;
import com.jee.clinichub.app.catalog.type.model.ProductTypeDto;

import lombok.Data;

@Data
public class ProductSearch {

	public String name;
	
	private CategoryDto category;
	
	private BrandDto brand;
	
	private ProductTypeDto type;
	
	public Integer available;
	
	public Integer expiry;
	
}
