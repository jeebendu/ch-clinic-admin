package com.jee.clinichub.app.appointment.visitLabResult.model;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.jee.clinichub.app.appointment.visitLabOrder.model.LabOrder;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
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
@EqualsAndHashCode
@ToString
@Table(name = "visit_lab_results")
public class LabResult extends Auditable<String> implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "lab_order_id")
    private LabOrder labOrder;

    private String result;
    private String unit;
    private String notes;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private LabResultStatus status;
    
    public LabResult(LabResultDTO labResult) {
        this.id = labResult.getId();
        this.result = labResult.getResult();
        this.unit = labResult.getUnit();
        this.notes = labResult.getNotes();
        this.status = labResult.getStatus();
    }

}
   