
package com.jee.clinichub.app.laboratory.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestTypeDTO {
    private Long id;
    private String name;
    private String description;
    private Boolean active;
    private Long categoryId;
    private String categoryName;
    private List<TestParameterDTO> parameters;
    private String createdBy;
    private LocalDateTime createdTime;
    private String modifiedBy;
    private LocalDateTime modifiedTime;

    public TestTypeDTO(TestType testType) {
        this.id = testType.getId();
        this.name = testType.getName();
        this.description = testType.getDescription();
        this.active = testType.getActive();
        this.createdBy = testType.getCreatedBy();
        this.createdTime = testType.getCreatedTime();
        this.modifiedBy = testType.getModifiedBy();
        this.modifiedTime = testType.getModifiedTime();
        
        if (testType.getCategory() != null) {
            this.categoryId = testType.getCategory().getId();
            this.categoryName = testType.getCategory().getName();
        }
        
        if (testType.getParameters() != null) {
            this.parameters = testType.getParameters().stream()
                .map(TestParameterDTO::new)
                .collect(Collectors.toList());
        }
    }
}
