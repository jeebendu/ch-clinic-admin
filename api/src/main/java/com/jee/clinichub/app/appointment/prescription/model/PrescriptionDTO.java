package com.jee.clinichub.app.appointment.prescription.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.appointment.appointmentType.model.AppointmentType;
import com.jee.clinichub.app.appointment.visitType.model.VisitType;
import com.jee.clinichub.app.doctor.model.DoctorDto;
import com.jee.clinichub.app.patient.model.PatientDto;
import com.jee.clinichub.app.patient.schedule.model.ScheduleDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PrescriptionDTO {

  private Long id;

  // List<MedicinesDTO> medicines = new ArrayList<MedicinesDTO>();

  private String previousHistory;
  private String previousClinicNote;
  private String clinicNotes;
  private String complaints;
  private String advice;
  private Date followUp;
  private String followUpNote;


  private ScheduleDto visit;
  private AppointmentType appointmentType;

  public PrescriptionDTO(Prescription prescription) {
    this.id = prescription.getId();

    this.previousHistory = prescription.getPreviousHistory();
    this.previousClinicNote = prescription.getPreviousClinicNote();
    this.clinicNotes = prescription.getClinicNotes();
    this.complaints = prescription.getComplaints();
    this.advice = prescription.getAdvice();
    this.followUp = prescription.getFollowUp();
    this.visit = new ScheduleDto(prescription.getVisit());
    this.followUpNote = prescription.getFollowUpNote();

    // prescription.getMedicines().forEach(item -> {
    //   MedicinesDTO medicinesObj = new MedicinesDTO(item);
    //   // medicinesObj.setPrescription(this);
    //   this.medicines.add(medicinesObj);
    // });

 

  }
}