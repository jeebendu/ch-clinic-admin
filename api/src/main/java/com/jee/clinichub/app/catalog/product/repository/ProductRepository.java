package com.jee.clinichub.app.catalog.product.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.catalog.category.model.CategoryDto;
import com.jee.clinichub.app.catalog.product.model.Product;
import com.jee.clinichub.app.catalog.product.model.ProductProj;
import com.jee.clinichub.app.catalog.product.model.ProductSearchProj;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>,ProductAdvanceRepository {
	
    Product findProductByName(String name);
    
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findByProductId(Long id);

	boolean existsByName(String name);

	boolean existsByNameAndIdNot(String name, Long id);
	
	List<ProductSearchProj> findAllProjectedByBranch_IdAndNameContainingIgnoreCaseOrderByNameDesc(Long branchId,String name);

	@Cacheable(value = "productCache" , keyGenerator = "multiTenantCacheKeyGenerator")
	List<ProductProj> findAllProjectedByBranch_IdOrderByNameAsc(Long branchId);

	List<ProductProj> findAllProjectedByBranch_IdAndNameContainingIgnoreCaseOrderByIdDesc(Long id, String name);

	List<ProductProj> findAllProjectedByBranchAndNameContainingIgnoreCaseAndCategoryOrderByIdDesc(Branch branch,String name, CategoryDto category);

	//boolean existsByNameAndBatch_id(@NotNull(message = "Name is mandatory") String name, Long batchId);

}