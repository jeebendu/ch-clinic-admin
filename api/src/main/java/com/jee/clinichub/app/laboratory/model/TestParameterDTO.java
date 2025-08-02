
package com.jee.clinichub.app.laboratory.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestParameterDTO {
    private Long id;
    private String name;
    private String unit;
    private BigDecimal referenceMin;
    private BigDecimal referenceMax;
    private String referenceText;
    private Boolean active;
    private Long testTypeId;
    private String testTypeName;
    private String createdBy;
    private LocalDateTime createdTime;
    private String modifiedBy;
    private LocalDateTime modifiedTime;

    public TestParameterDTO(TestParameter testParameter) {
        this.id = testParameter.getId();
        this.name = testParameter.getName();
        this.unit = testParameter.getUnit();
        this.referenceMin = testParameter.getReferenceMin();
        this.referenceMax = testParameter.getReferenceMax();
        this.referenceText = testParameter.getReferenceText();
        this.active = testParameter.getActive();
        this.createdBy = testParameter.getCreatedBy();
        this.createdTime = testParameter.getCreatedTime();
        this.modifiedBy = testParameter.getModifiedBy();
        this.modifiedTime = testParameter.getModifiedTime();
        
        if (testParameter.getTestType() != null) {
            this.testTypeId = testParameter.getTestType().getId();
            this.testTypeName = testParameter.getTestType().getName();
        }
    }
}
