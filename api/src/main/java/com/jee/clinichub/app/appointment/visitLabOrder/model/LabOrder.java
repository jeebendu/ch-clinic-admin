package com.jee.clinichub.app.appointment.visitLabOrder.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.jee.clinichub.app.appointment.labtest.model.LabTest;
import com.jee.clinichub.app.appointment.visitLabResult.model.LabResult;
import com.jee.clinichub.app.appointment.visitLabResult.model.LabResultDTO;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.app.patient.schedule.model.Schedule;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
@Table(name = "visit_lab_order")
@ToString
@EqualsAndHashCode(callSuper = false, exclude = {"labresults"})
public class LabOrder extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "visit_id")
    private Schedule visit;
    
    @OneToOne
    @JoinColumn(name = "labtest_id")
    private LabTest labtest;

    @Column(name = "priority")
    @Enumerated(EnumType.STRING)
    private PriorityTest priority;
    private String notes;
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private LabOrderStatus status;

    
    @JsonManagedReference
    @OneToMany(mappedBy = "labOrder", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    List<LabResult> labresults = new ArrayList<LabResult>();

    public LabOrder(LabOrderDTO labOrder) {
        if (labOrder.getId() != null) {
            this.id = labOrder.getId();
        }
        this.labtest = new LabTest(labOrder.getLabtest());
        this.priority = labOrder.getPriority();
        this.notes = labOrder.getNotes();
        this.status = labOrder.getStatus();

        // For laborder res
        labOrder.getLabresults().forEach(item -> {
            LabResult labResObj = new LabResult(item);
            labResObj.setLabOrder(this);
            this.labresults.add(labResObj);
        });
    }

}
