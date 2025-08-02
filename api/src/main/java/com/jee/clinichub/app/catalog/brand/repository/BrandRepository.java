package com.jee.clinichub.app.catalog.brand.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.catalog.brand.model.Brand;
import org.springframework.data.domain.Page;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {

	Brand findBrandByName(String name);

	boolean existsByName(String name);

	boolean existsByNameAndIdNot(String name, Long id);

	Brand findBrandById(Long brandId);

	List<Brand> findByOrderByNameAsc();

    Brand findFirstByName(String string);


	@Query("SELECT b FROM Brand b " +
			"WHERE (:value IS NULL OR LOWER(b.name) LIKE LOWER(CONCAT('%', :value, '%'))) " +
			"ORDER BY b.id DESC")
	Page<Brand> search(
			Pageable pr,
			// @Param("branchId") Long branchId,
			@Param("value") String value);

}