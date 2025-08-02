package com.jee.clinichub.app.catalog.type.service;

import java.util.List;

import com.jee.clinichub.app.catalog.type.model.ProductType;
import com.jee.clinichub.app.catalog.type.model.ProductTypeDto;
import com.jee.clinichub.global.model.Status;

public interface ProductTypeService {
	
    ProductType findByName(String name);

    ProductTypeDto getById(Long id);

	Status deleteById(Long id);

	Status saveOrUpdate(ProductTypeDto ProductType);

	List<ProductTypeDto> getAllProductTypes();
}
