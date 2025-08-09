
package com.jee.clinichub.app.laborder.model;

import java.time.LocalDateTime;

import com.jee.clinichub.app.laborder.model.enums.LabOrderItemStatus;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LabOrderItemDTO {

    private Long id;
    
    @NotNull(message = "Test type ID is mandatory")
    private Long testTypeId;
    
    private LabOrderItemStatus status = LabOrderItemStatus.PENDING;
    private Boolean sampleCollected = false;
    private LocalDateTime sampleCollectionDate;

    public LabOrderItemDTO(LabOrderItem labOrderItem) {
        if (labOrderItem.getId() != null) {
            this.id = labOrderItem.getId();
        }
        this.testTypeId = labOrderItem.getTestTypeId();
        this.status = labOrderItem.getStatus();
        this.sampleCollected = labOrderItem.getSampleCollected();
        this.sampleCollectionDate = labOrderItem.getSampleCollectionDate();
    }
}
