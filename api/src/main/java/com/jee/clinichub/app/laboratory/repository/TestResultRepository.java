
package com.jee.clinichub.app.laboratory.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.laboratory.model.TestResult;

@Repository
public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    
    List<TestResult> findByTestReportId(Long testReportId);
    
    List<TestResult> findByTestParameterId(Long testParameterId);
    
    void deleteByTestReportId(Long testReportId);
}
