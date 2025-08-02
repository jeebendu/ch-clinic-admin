
package com.jee.clinichub.app.laboratory.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.laboratory.model.TestCategory;

@Repository
public interface TestCategoryRepository extends JpaRepository<TestCategory, Long> {
    
    List<TestCategory> findByActiveTrue();
    
    @Query("SELECT tc FROM TestCategory tc LEFT JOIN FETCH tc.testTypes WHERE tc.active = true")
    List<TestCategory> findAllActiveWithTestTypes();
    
    boolean existsByName(String name);
}
