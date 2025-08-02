package com.jee.clinichub.app.catalog.product.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.catalog.product.model.ProductSearch;
import com.jee.clinichub.app.catalog.product.model.ProductViewDTO;

@Repository
public interface ProductAdvanceRepository {
	Page<ProductViewDTO> searchProducts(Pageable pageable, ProductSearch search);
}
