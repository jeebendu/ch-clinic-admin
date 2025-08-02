
package com.jee.clinichub.app.appointment.appointments.model;

import java.time.LocalTime;
import java.util.UUID;

import com.jee.clinichub.app.doctor.model.DoctorBranchDto;
import com.jee.clinichub.app.doctor.slots.model.Slot;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.app.patient.patientRelation.model.RelationWith;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentsDto {

    private Long id;
    private Patient patient;
    private AppointmentStatus status;
    private DoctorBranchDto doctorBranch;
    private RelationWith familyMember;
    private Slot slot;
    private String bookingId;
    private UUID globalAppointmentId;
    private String cancelReason;
    private LocalTime expectedTime;

    public AppointmentsDto(Appointments request) {
        this.id = request.getId();
        this.doctorBranch = new DoctorBranchDto(request.getDoctorBranch());
        this.familyMember = request.getFamilyMember(); 
        this.status = request.getStatus();
        this.patient = request.getPatient();
        this.slot = request.getSlot();
        this.bookingId = request.getBookingId();
        this.globalAppointmentId = request.getGlobalAppointmentId();
        this.cancelReason = request.getCancelReason();
        this.expectedTime=request.getExpectedTime();
    }
}
