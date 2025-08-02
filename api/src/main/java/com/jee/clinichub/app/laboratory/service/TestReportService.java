package com.jee.clinichub.app.laboratory.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.jee.clinichub.app.laboratory.model.TestReportDTO;
import com.jee.clinichub.global.model.Status;

public interface TestReportService {
    
    List<TestReportDTO> getAllReports();
    
    Page<TestReportDTO> getAllReports(Pageable pageable);
    
    TestReportDTO getReportById(Long id);
    
    TestReportDTO getReportByIdWithResults(Long id);
    
    List<TestReportDTO> getReportsByPatientId(Long patientId);
    
    Page<TestReportDTO> getReportsByPatientId(Long patientId, Pageable pageable);
    
    Status saveOrUpdateReport(TestReportDTO testReportDTO);
    
    Status deleteReportById(Long id);
    
    String generateReportNumber();
    
    byte[] downloadReportPdf(Long id);
    
    Status sendReportByEmail(Long reportId, String toEmail, String subject);
}
