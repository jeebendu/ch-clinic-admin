
package com.jee.clinichub.app.laborder.model;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.jee.clinichub.app.laborder.model.enums.LabOrderItemStatus;
import com.jee.clinichub.config.audit.Auditable;

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
@Table(name = "lab_order_items")
@ToString
@EqualsAndHashCode(callSuper = false)
public class LabOrderItem extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lab_order_id")
    private LabOrder labOrder;

    @Column(name = "test_type_id", nullable = false)
    private Long testTypeId;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private LabOrderItemStatus status = LabOrderItemStatus.PENDING;

    @Column(name = "sample_collected")
    private Boolean sampleCollected = false;

    @Column(name = "sample_collection_date")
    private LocalDateTime sampleCollectionDate;

    public LabOrderItem(LabOrderItemDTO labOrderItemDTO) {
        if (labOrderItemDTO.getId() != null) {
            this.id = labOrderItemDTO.getId();
        }
        this.testTypeId = labOrderItemDTO.getTestTypeId();
        this.status = labOrderItemDTO.getStatus();
        this.sampleCollected = labOrderItemDTO.getSampleCollected();
        this.sampleCollectionDate = labOrderItemDTO.getSampleCollectionDate();
    }
}
