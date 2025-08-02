
package com.jee.clinichub.app.laboratory.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.laboratory.model.TestReport;

@Repository
public interface TestReportRepository extends JpaRepository<TestReport, Long> {
    
    List<TestReport> findByPatientId(Long patientId);
    
    @Query("SELECT tr FROM TestReport tr LEFT JOIN FETCH tr.results WHERE tr.id = :id")
    TestReport findByIdWithResults(@Param("id") Long id);
    
    @Query("SELECT tr FROM TestReport tr WHERE tr.reportDate BETWEEN :startDate AND :endDate")
    List<TestReport> findByReportDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    Page<TestReport> findByPatientId(Long patientId, Pageable pageable);
    
    Page<TestReport> findByStatus(TestReport.TestReportStatus status, Pageable pageable);
    
    boolean existsByReportNumber(String reportNumber);
    
    @Query("SELECT MAX(CAST(SUBSTRING(tr.reportNumber, 4) AS int)) FROM TestReport tr WHERE tr.reportNumber LIKE 'LAB%'")
    Integer findMaxReportSequence();
}
