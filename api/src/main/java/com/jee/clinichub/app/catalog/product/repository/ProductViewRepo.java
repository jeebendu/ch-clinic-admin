package com.jee.clinichub.app.catalog.product.repository;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.catalog.product.model.ProductViewDTO;

@Repository
public interface ProductViewRepo extends JpaRepository<ProductViewDTO, Long> {

       @Cacheable(value = "productCache", keyGenerator = "multiTenantCacheKeyGenerator")
       @Query("SELECT pro " +
              "FROM ProductViewDTO pro " +
              "WHERE pro.branchId = :branchId " +
              "AND (:name IS NULL OR pro.name ILIKE '%' || CAST(:name AS text) || '%') " +
              "AND (:categoryId IS NULL OR pro.categoryId = :categoryId) " +
              "AND (:brandId IS NULL OR pro.brandId = :brandId) " +
              "AND (:typeId IS NULL OR pro.typeId = :typeId) " +
              "AND (:qtyFrom IS NULL OR pro.qty >= :qtyFrom) " +
              "AND (:qtyTo IS NULL OR pro.qty <= :qtyTo) " +
              "AND (:expiryMonth IS NULL OR pro.expiryMonth = :expiryMonth)"
       )
       Page<ProductViewDTO> filterProducts(
              Pageable pageable,
              @Param("branchId") Long branchId,
              @Param("name") String name,
              @Param("categoryId") Long categoryId,
              @Param("brandId") Long brandId,
              @Param("typeId") Long typeId,
              @Param("qtyFrom") Integer qtyFrom,
              @Param("qtyTo") Integer qtyTo,
              @Param("expiryMonth") Integer expiryMonth
       );
}
