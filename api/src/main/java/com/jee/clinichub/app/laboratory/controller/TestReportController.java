package com.jee.clinichub.app.laboratory.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jee.clinichub.app.laboratory.model.TestReportDTO;
import com.jee.clinichub.app.laboratory.service.TestReportService;
import com.jee.clinichub.global.model.Status;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/v1/laboratory/reports")
@Tag(name = "Test Reports", description = "Laboratory Test Reports Management")
public class TestReportController {

    @Autowired
    private TestReportService testReportService;

    @GetMapping("/list")
    @Operation(summary = "Get all test reports")
    public ResponseEntity<List<TestReportDTO>> getAllReports() {
        return ResponseEntity.ok(testReportService.getAllReports());
    }

    @GetMapping("/list/{page}/{size}")
    @Operation(summary = "Get paginated test reports")
    public ResponseEntity<Page<TestReportDTO>> getAllReports(
            @PathVariable int page,
            @PathVariable int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(testReportService.getAllReports(pageable));
    }

    @GetMapping("/id/{id}")
    @Operation(summary = "Get test report by ID")
    public ResponseEntity<TestReportDTO> getReportById(@PathVariable Long id) {
        TestReportDTO report = testReportService.getReportById(id);
        return report != null ? ResponseEntity.ok(report) : ResponseEntity.notFound().build();
    }

    @GetMapping("/id/{id}/with-results")
    @Operation(summary = "Get test report by ID with results")
    public ResponseEntity<TestReportDTO> getReportByIdWithResults(@PathVariable Long id) {
        TestReportDTO report = testReportService.getReportByIdWithResults(id);
        return report != null ? ResponseEntity.ok(report) : ResponseEntity.notFound().build();
    }

    @GetMapping("/patient/{patientId}")
    @Operation(summary = "Get test reports by patient ID")
    public ResponseEntity<List<TestReportDTO>> getReportsByPatientId(@PathVariable Long patientId) {
        return ResponseEntity.ok(testReportService.getReportsByPatientId(patientId));
    }

    @GetMapping("/patient/{patientId}/{page}/{size}")
    @Operation(summary = "Get paginated test reports by patient ID")
    public ResponseEntity<Page<TestReportDTO>> getReportsByPatientId(
            @PathVariable Long patientId,
            @PathVariable int page,
            @PathVariable int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(testReportService.getReportsByPatientId(patientId, pageable));
    }

    @PostMapping("/saveOrUpdate")
    @Operation(summary = "Save or update test report")
    public ResponseEntity<Status> saveOrUpdateReport(@RequestBody TestReportDTO testReportDTO) {
        return ResponseEntity.ok(testReportService.saveOrUpdateReport(testReportDTO));
    }

    @DeleteMapping("/delete/id/{id}")
    @Operation(summary = "Delete test report by ID")
    public ResponseEntity<Status> deleteReportById(@PathVariable Long id) {
        return ResponseEntity.ok(testReportService.deleteReportById(id));
    }

    @GetMapping("/generate-report-number")
    @Operation(summary = "Generate new report number")
    public ResponseEntity<String> generateReportNumber() {
        return ResponseEntity.ok(testReportService.generateReportNumber());
    }

    @GetMapping("/download/pdf/id/{id}")
    @Operation(summary = "Download test report as PDF")
    public ResponseEntity<byte[]> downloadReportPdf(@PathVariable Long id) {
        try {
            byte[] pdfData = testReportService.downloadReportPdf(id);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "Laboratory_Report_" + id + ".pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfData);
                    
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/send-email/id/{reportId}")
    @Operation(summary = "Send test report by email")
    public ResponseEntity<Status> sendReportByEmail(
            @PathVariable Long reportId,
            @RequestBody EmailRequest emailRequest) {
        return ResponseEntity.ok(
            testReportService.sendReportByEmail(reportId, emailRequest.getToEmail(), emailRequest.getSubject())
        );
    }
    
    // Inner class for email request
    public static class EmailRequest {
        private String toEmail;
        private String subject;
        
        public String getToEmail() {
            return toEmail;
        }
        
        public void setToEmail(String toEmail) {
            this.toEmail = toEmail;
        }
        
        public String getSubject() {
            return subject;
        }
        
        public void setSubject(String subject) {
            this.subject = subject;
        }
    }
}
