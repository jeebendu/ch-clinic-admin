
package com.jee.clinichub.app.laboratory.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestResultDTO {
    private Long id;
    private Long testReportId;
    private TestParameterDTO testParameter;
    private BigDecimal resultValue;
    private String resultText;
    private String unitOverride;
    private String notes;
    private TestResult.ResultFlag flag;
    private String createdBy;
    private LocalDateTime createdTime;
    private String modifiedBy;
    private LocalDateTime modifiedTime;

    public TestResultDTO(TestResult testResult) {
        this.id = testResult.getId();
        this.resultValue = testResult.getResultValue();
        this.resultText = testResult.getResultText();
        this.unitOverride = testResult.getUnitOverride();
        this.notes = testResult.getNotes();
        this.flag = testResult.getFlag();
        this.createdBy = testResult.getCreatedBy();
        this.createdTime = testResult.getCreatedTime();
        this.modifiedBy = testResult.getModifiedBy();
        this.modifiedTime = testResult.getModifiedTime();
        
        if (testResult.getTestReport() != null) {
            this.testReportId = testResult.getTestReport().getId();
        }
        
        if (testResult.getTestParameter() != null) {
            this.testParameter = new TestParameterDTO(testResult.getTestParameter());
        }
    }
}
