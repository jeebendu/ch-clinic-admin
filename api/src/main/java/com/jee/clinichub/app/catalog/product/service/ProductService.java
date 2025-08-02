package com.jee.clinichub.app.catalog.product.service;

import java.util.List;

import org.springframework.data.domain.Page;
// import org.springframework.hateoas.EntityModel;
// import org.springframework.hateoas.PagedModel;

import com.jee.clinichub.app.catalog.product.model.Product;
import com.jee.clinichub.app.catalog.product.model.ProductDto;
import com.jee.clinichub.app.catalog.product.model.ProductProj;
import com.jee.clinichub.app.catalog.product.model.ProductSearch;
import com.jee.clinichub.app.catalog.product.model.ProductSearchProj;
import com.jee.clinichub.app.catalog.product.model.ProductViewDTO;
import com.jee.clinichub.app.core.model.Search;
import com.jee.clinichub.global.model.Status;

public interface ProductService {
	
    Product findByName(String name);

    ProductDto getById(Long id);

	Status deleteById(Long id);

	Status saveOrUpdate(ProductDto Product);

	List<ProductProj> getAllProducts();

	boolean updateQty(Product product);

	List<ProductProj> searchProducts(Search search);

	List<ProductSearchProj> searchProductsByName(Search search);

	Page<ProductViewDTO> filterProduct(int page,int size,ProductSearch search);
}
