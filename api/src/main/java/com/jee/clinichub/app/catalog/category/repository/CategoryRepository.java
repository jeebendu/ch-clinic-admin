package com.jee.clinichub.app.catalog.category.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.catalog.category.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
	
    Category findCategoryByName(String name);
    
    Category findCategoryById(Long id);

	boolean existsByName(String name);

	boolean existsByNameAndIdNot(String name, Long id);

	List<Category> findByOrderByNameAsc();

    Category findByNameIgnoreCase(String string);

	
}