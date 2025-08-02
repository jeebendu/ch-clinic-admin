package com.jee.clinichub.app.appointment.prescription.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.jee.clinichub.app.patient.schedule.model.Schedule;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "prescription")
public class Prescription extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // @JsonManagedReference
    // @OneToMany(mappedBy = "prescription", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    // List<Medicines> medicines = new ArrayList<Medicines>();


    @Column(name = "previous_history")
    private String previousHistory;

    @Column(name = "previous_clinic_note")
    private String previousClinicNote;

    @Column(name = "clinic_notes")
    private String clinicNotes;

    private String complaints;
    private String advice;

    @Column(name = "follow_up")
    private Date followUp;

    @Column(name = "follow_up_note")
    private String followUpNote;
    // private String diagnosis;


    @OneToOne
    @JoinColumn(name = "visit_id")
    private Schedule visit;



    public Prescription(PrescriptionDTO prescription) {

        this.id = prescription.getId();

        this.previousHistory = prescription.getPreviousHistory();
        this.previousClinicNote = prescription.getPreviousClinicNote();
        this.clinicNotes = prescription.getClinicNotes();
        this.complaints = prescription.getComplaints();
        this.advice = prescription.getAdvice();
        this.followUp = prescription.getFollowUp();
         this.visit = new Schedule(prescription.getVisit());
        this.followUpNote = prescription.getFollowUpNote();

        // prescription.getMedicines().forEach(item -> {
        //     Medicines medicinesObj = new Medicines(item);
        //     medicinesObj.setPrescription(this);
        //     this.medicines.add(medicinesObj);
        // });

  
    }
}
