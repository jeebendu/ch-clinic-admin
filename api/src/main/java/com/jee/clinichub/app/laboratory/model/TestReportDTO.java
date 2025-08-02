
package com.jee.clinichub.app.laboratory.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.jee.clinichub.app.patient.model.PatientDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestReportDTO {
    private Long id;
    private String reportNumber;
    private PatientDto patient;
    private TestTypeDTO testType;
    private LocalDateTime reportDate;
    private String diagnosis;
    private String comments;
    private TestReport.TestReportStatus status;
    private List<TestResultDTO> results;
    private String createdBy;
    private LocalDateTime createdTime;
    private String modifiedBy;
    private LocalDateTime modifiedTime;

    public TestReportDTO(TestReport testReport) {
        this.id = testReport.getId();
        this.reportNumber = testReport.getReportNumber();
        this.reportDate = testReport.getReportDate();
        this.diagnosis = testReport.getDiagnosis();
        this.comments = testReport.getComments();
        this.status = testReport.getStatus();
        this.createdBy = testReport.getCreatedBy();
        this.createdTime = testReport.getCreatedTime();
        this.modifiedBy = testReport.getModifiedBy();
        this.modifiedTime = testReport.getModifiedTime();
        
        if (testReport.getPatient() != null) {
            this.patient = new PatientDto(testReport.getPatient());
        }
        
        if (testReport.getTestType() != null) {
            this.testType = new TestTypeDTO(testReport.getTestType());
        }
        
        if (testReport.getResults() != null) {
            this.results = testReport.getResults().stream()
                .map(TestResultDTO::new)
                .collect(Collectors.toList());
        }
    }
}
