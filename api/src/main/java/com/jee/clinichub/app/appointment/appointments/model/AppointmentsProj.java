package com.jee.clinichub.app.appointment.appointments.model;


import com.jee.clinichub.app.doctor.model.DoctorBranch;
import com.jee.clinichub.app.doctor.model.DoctorBranchProj;
import com.jee.clinichub.app.doctor.slots.model.SlotProj;
import com.jee.clinichub.app.patient.model.PatientProj;
import com.jee.clinichub.app.patient.patientRelation.model.RelationWithProj;

public interface AppointmentsProj {
    
    Long getId();
    DoctorBranchProj getDoctorBranch();
    RelationWithProj getFamilyMember();
    PatientProj getPatient();
    String getStatus();
    SlotProj getSlot();
    String getBookingId();
    String getCancelReason();
    String getGlobalAppointmentId();
}
