
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
public class TestCategoryDTO {
    private Long id;
    private String name;
    private String description;
    private Boolean active;
    private List<TestTypeDTO> testTypes;
    private String createdBy;
    private LocalDateTime createdTime;
    private String modifiedBy;
    private LocalDateTime modifiedTime;

    public TestCategoryDTO(TestCategory testCategory) {
        this.id = testCategory.getId();
        this.name = testCategory.getName();
        this.description = testCategory.getDescription();
        this.active = testCategory.getActive();
        this.createdBy = testCategory.getCreatedBy();
        this.createdTime = testCategory.getCreatedTime();
        this.modifiedBy = testCategory.getModifiedBy();
        this.modifiedTime = testCategory.getModifiedTime();
        
        if (testCategory.getTestTypes() != null) {
            this.testTypes = testCategory.getTestTypes().stream()
                .map(TestTypeDTO::new)
                .collect(Collectors.toList());
        }
    }
}
