
package com.jee.clinichub.app.laborder.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.jee.clinichub.app.laborder.model.enums.LabOrderPriority;
import com.jee.clinichub.app.laborder.model.enums.LabOrderStatus;
import com.jee.clinichub.app.patient.model.PatientDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LabOrderDTO {

    private Long id;
    private Long visitId;
    
    @NotNull(message = "Patient is mandatory")
    private PatientDto patient;
    
    @NotNull(message = "Branch is mandatory")
    private Long branchId;
    
    @NotBlank(message = "Order number is mandatory")
    private String orderNumber;
    
    private LabOrderStatus status = LabOrderStatus.PENDING;
    private LabOrderPriority priority = LabOrderPriority.ROUTINE;
    private LocalDateTime orderDate;
    private LocalDateTime expectedDate;
    private String referringDoctor;
    private String comments;
    
    private List<LabOrderItemDTO> labOrderItems = new ArrayList<>();

    public LabOrderDTO(LabOrderV2 labOrder) {
        if (labOrder.getId() != null) {
            this.id = labOrder.getId();
        }
        this.visitId = labOrder.getVisitId();
        if (labOrder.getPatient() != null) {
            this.patient = new PatientDto(labOrder.getPatient());
        }
        this.branchId = labOrder.getBranchId();
        this.orderNumber = labOrder.getOrderNumber();
        this.status = labOrder.getStatus();
        this.priority = labOrder.getPriority();
        this.orderDate = labOrder.getOrderDate();
        this.expectedDate = labOrder.getExpectedDate();
        this.referringDoctor = labOrder.getReferringDoctor();
        this.comments = labOrder.getComments();

        // Convert entity items to DTOs
        labOrder.getLabOrderItems().forEach(item -> {
            this.labOrderItems.add(new LabOrderItemDTO(item));
        });
    }
}
