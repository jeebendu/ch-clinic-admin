
package com.jee.clinichub.app.laboratory.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.laboratory.model.TestParameter;

@Repository
public interface TestParameterRepository extends JpaRepository<TestParameter, Long> {
    
    List<TestParameter> findByActiveTrue();
    
    List<TestParameter> findByTestTypeIdAndActiveTrue(Long testTypeId);
    
    boolean existsByNameAndTestTypeId(String name, Long testTypeId);
}
