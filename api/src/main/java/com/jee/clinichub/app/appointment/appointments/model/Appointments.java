package com.jee.clinichub.app.appointment.appointments.model;

import java.io.Serializable;
import java.time.LocalTime;
import java.util.UUID;

import com.jee.clinichub.app.doctor.model.DoctorBranch;
import com.jee.clinichub.app.doctor.slots.model.Slot;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.app.patient.patientRelation.model.RelationWith;
import com.jee.clinichub.config.audit.Auditable;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "appointment")
public class Appointments extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    @OneToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @OneToOne
    @JoinColumn(name = "doctor_branch_id")
    private DoctorBranch doctorBranch;

    @OneToOne
    @JoinColumn(name = "family_member_id")
    private RelationWith familyMember;

    @OneToOne
    @JoinColumn(name = "slot_id")
    private Slot slot;

    @Column(name = "booking_id")
    private String bookingId;

    @Column(name = "cancel_reason")
    private String cancelReason;

    @Column(name = "global_appointment_id", unique = true)
    private UUID globalAppointmentId;

    @Column(name = "expected_time")
    private LocalTime expectedTime;

    @PrePersist
    public void generateGlobalUuid() {
        if (this.globalAppointmentId == null) {
            this.globalAppointmentId = UUID.randomUUID();
        }
    }

    public Appointments(AppointmentsDto appointment) {
        this.id = appointment.getId();
        this.patient = appointment.getPatient();
        this.status = appointment.getStatus();
        this.doctorBranch = new DoctorBranch(appointment.getDoctorBranch());
        this.familyMember = appointment.getFamilyMember();
        this.slot = appointment.getSlot();
        this.bookingId = appointment.getBookingId();
        // Ensure globalAppointmentId from DTO is used if provided
        this.globalAppointmentId = appointment.getGlobalAppointmentId();
        this.cancelReason = appointment.getCancelReason();
        this.expectedTime = appointment.getExpectedTime();
    }

    public static Appointments fromDto(AppointmentsDto appointmentDto) {
        Appointments appointment = new Appointments();
        // Use globalAppointmentId from DTO if provided, otherwise it will be generated
        // in @PrePersist
        appointment.setGlobalAppointmentId(appointmentDto.getGlobalAppointmentId());
        appointment.setStatus(
                appointmentDto.getStatus() != null ? appointmentDto.getStatus() : AppointmentStatus.UPCOMING);
        appointment.setPatient(appointmentDto.getPatient());
        appointment.setDoctorBranch(new DoctorBranch(appointmentDto.getDoctorBranch()));
        appointment.setFamilyMember(appointmentDto.getFamilyMember());
        appointment.setSlot(appointmentDto.getSlot());
        appointment.setBookingId(appointmentDto.getBookingId());
        appointment.setCancelReason(appointmentDto.getCancelReason());
        appointment.setExpectedTime(appointmentDto.getExpectedTime());
        return appointment;
    }

    public void updateFromDto(AppointmentsDto appointmentDto) {
        this.setStatus(appointmentDto.getStatus());
        this.setPatient(appointmentDto.getPatient());
        this.setDoctorBranch(new DoctorBranch(appointmentDto.getDoctorBranch()));
        this.setFamilyMember(appointmentDto.getFamilyMember());
        this.setSlot(appointmentDto.getSlot());
        this.setBookingId(appointmentDto.getBookingId());
        this.setCancelReason(appointmentDto.getCancelReason());
        this.setExpectedTime(appointmentDto.getExpectedTime());
        // Don't update globalAppointmentId - it should remain unchanged for existing
        // appointments
    }
}
