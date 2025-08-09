
package com.jee.clinichub.app.laborder.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.jee.clinichub.app.laborder.model.enums.LabOrderPriority;
import com.jee.clinichub.app.laborder.model.enums.LabOrderStatus;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "lab_orders")
@ToString
@EqualsAndHashCode(callSuper = false, exclude = {"labOrderItems"})
public class LabOrderV2 extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "visit_id")
    private Long visitId;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @Column(name = "branch_id", nullable = false)
    private Long branchId;

    @Column(name = "order_number", unique = true, nullable = false)
    private String orderNumber;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private LabOrderStatus status = LabOrderStatus.PENDING;

    @Column(name = "priority")
    @Enumerated(EnumType.STRING)
    private LabOrderPriority priority = LabOrderPriority.ROUTINE;

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    @Column(name = "expected_date")
    private LocalDateTime expectedDate;

    @Column(name = "referring_doctor")
    private String referringDoctor;

    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments;

    @JsonManagedReference
    @OneToMany(mappedBy = "labOrder", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<LabOrderItem> labOrderItems = new ArrayList<>();

    public LabOrderV2(LabOrderDTO labOrderDTO) {
        if (labOrderDTO.getId() != null) {
            this.id = labOrderDTO.getId();
        }
        this.visitId = labOrderDTO.getVisitId();
        this.branchId = labOrderDTO.getBranchId();
        this.orderNumber = labOrderDTO.getOrderNumber();
        this.status = labOrderDTO.getStatus();
        this.priority = labOrderDTO.getPriority();
        this.orderDate = labOrderDTO.getOrderDate();
        this.expectedDate = labOrderDTO.getExpectedDate();
        this.referringDoctor = labOrderDTO.getReferringDoctor();
        this.comments = labOrderDTO.getComments();

        // Convert DTO items to entities
        labOrderDTO.getLabOrderItems().forEach(itemDTO -> {
            LabOrderItem item = new LabOrderItem(itemDTO);
            item.setLabOrder(this);
            this.labOrderItems.add(item);
        });
    }
}
