
package com.jee.clinichub.app.laboratory.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.laboratory.model.TestType;

@Repository
public interface TestTypeRepository extends JpaRepository<TestType, Long> {
    
    List<TestType> findByActiveTrue();
    
    List<TestType> findByCategoryIdAndActiveTrue(Long categoryId);
    
    @Query("SELECT tt FROM TestType tt LEFT JOIN FETCH tt.parameters WHERE tt.id = :id AND tt.active = true")
    TestType findByIdWithParameters(@Param("id") Long id);
    
    boolean existsByNameAndCategoryId(String name, Long categoryId);
}
