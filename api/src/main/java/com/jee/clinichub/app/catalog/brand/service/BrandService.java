package com.jee.clinichub.app.catalog.brand.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.jee.clinichub.app.catalog.brand.model.Brand;
import com.jee.clinichub.app.catalog.brand.model.BrandDto;
import com.jee.clinichub.app.catalog.brand.model.Search;
import com.jee.clinichub.app.patient.model.PatientProj;
import com.jee.clinichub.global.model.Status;

public interface BrandService {
	
    Brand findByName(String name);

    BrandDto getById(Long id);

	Status deleteById(Long id);

	Status saveOrUpdate(BrandDto Brand);

	List<BrandDto> getAllBrands();

    Page<Brand> search(Search brandSearch, int pageNo, int pageSize);
}
