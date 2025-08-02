package com.jee.clinichub.app.catalog.type.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.catalog.type.model.ProductType;

@Repository
public interface ProductTypeRepository extends JpaRepository<ProductType, Long> {
	
    ProductType findProductTypeByName(String name);

	boolean existsByName(String name);

	boolean existsByNameAndIdNot(String name, Long id);

	ProductType findProductTypeById(Long brandId);

	List<ProductType> findByOrderByNameAsc();

}