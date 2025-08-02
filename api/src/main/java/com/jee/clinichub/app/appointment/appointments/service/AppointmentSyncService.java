package com.jee.clinichub.app.appointment.appointments.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.jee.clinichub.app.appointment.appointments.model.Appointments;
import com.jee.clinichub.app.appointment.appointments.model.AppointmentsDto;
import com.jee.clinichub.app.appointment.appointments.repository.AppointmentsRepo;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.service.BranchService;
import com.jee.clinichub.app.doctor.model.DoctorBranch;
import com.jee.clinichub.app.doctor.service.DoctorService;
import com.jee.clinichub.app.doctor.slots.model.Slot;
import com.jee.clinichub.app.doctor.slots.model.SlotStatus;
import com.jee.clinichub.app.doctor.slots.service.SlotService;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.app.patient.model.PatientDto;
import com.jee.clinichub.app.patient.patientRelation.model.RelationWith;
import com.jee.clinichub.app.patient.patientRelation.repository.RelationWithRepo;
import com.jee.clinichub.app.patient.patientRelation.service.RelationWithService;
import com.jee.clinichub.app.patient.repository.PatientRepository;
import com.jee.clinichub.app.patient.service.PatientService;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class AppointmentSyncService {

    private final AppointmentsRepo appointmentsRepo;
    private final PatientService patientService;
    private final SlotService slotService;
    private final PatientRepository patientRepository;
    private final BranchService branchService;
    private final DoctorService doctorService;
    private final EntityManager entityManager;
    private final RelationWithService relationWithService;
    private final RelationWithRepo relationWithRepo;

    @Value("${app.default-tenant}")
    private String defaultTenant;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void syncAppointmentToMaster(AppointmentsDto appointmentDto, String sourceTenant) {
        String originalTenantContext = TenantContextHolder.getCurrentTenant();
        try {
            TenantContextHolder.setCurrentTenant(defaultTenant);

            // Ensure globalAppointmentId is set
            if (appointmentDto.getGlobalAppointmentId() == null) {
                log.error("AppointmentDto is missing globalAppointmentId. BookingId: {}",
                        appointmentDto.getBookingId());
                throw new IllegalArgumentException("GlobalAppointmentId cannot be null");
            }

            Optional<Appointments> existingAppointment = appointmentsRepo
                    .findByGlobalAppointmentId(appointmentDto.getGlobalAppointmentId());

            Appointments appointment;
            if (existingAppointment.isPresent()) {
                appointment = existingAppointment.get();
                appointment.updateFromDto(appointmentDto);
            } else {
                appointment = Appointments.fromDto(appointmentDto);
                // Ensure the globalAppointmentId matches what's in the DTO
                appointment.setGlobalAppointmentId(appointmentDto.getGlobalAppointmentId());
            }

            appointmentsRepo.save(appointment);
            log.info("Successfully synced appointment to master schema. GlobalAppointmentId: {}",
                    appointmentDto.getGlobalAppointmentId());

        } catch (Exception e) {
            log.error(
                    "Error syncing appointment to master schema. BookingId: '{}', GlobalAppointmentId: {}, Source tenant: {}. Error: {}",
                    appointmentDto.getBookingId(), appointmentDto.getGlobalAppointmentId(), sourceTenant,
                    e.getMessage(), e);
            throw new RuntimeException("Failed to sync appointment to master schema for GlobalAppointmentId: "
                    + appointmentDto.getGlobalAppointmentId(), e);
        } finally {
            TenantContextHolder.setCurrentTenant(originalTenantContext);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void syncAppointmentToTenant(AppointmentsDto appointmentDto, String targetTenant) {
        String originalTenantContext = TenantContextHolder.getCurrentTenant();
        try {
            TenantContextHolder.setCurrentTenant(targetTenant);
            appointmentDto.setId(null);
            // Ensure globalAppointmentId is ``
            if (appointmentDto.getGlobalAppointmentId() == null) {
                log.error("AppointmentDto is missing globalAppointmentId. BookingId: {}",
                        appointmentDto.getBookingId());
                throw new IllegalArgumentException("GlobalAppointmentId cannot be null");
            }

            Optional<Appointments> existingAppointment = appointmentsRepo
                    .findByGlobalAppointmentId(appointmentDto.getGlobalAppointmentId());

            Optional<Branch> optionalExistBranch = branchService
                    .getByGlobalId(appointmentDto.getDoctorBranch().getBranch().getGlobalBranchId());
            if (optionalExistBranch.isEmpty()) {
                throw new EntityNotFoundException("Branch not found at tenant: " + targetTenant);
            }

            // Get a fresh reference to the branch to avoid detached entity issues
            Branch branchReference = entityManager.getReference(Branch.class, optionalExistBranch.get().getId());

            // Handle Patient - find existing or create new
            Patient existingPatient = patientService
                    .findPatientByGlobalId(appointmentDto.getPatient().getGlobalPatientId());

            RelationWith existRelative;
            if (appointmentDto.getFamilyMember() != null) {
                existRelative = relationWithService
                        .findByGlobalId(appointmentDto.getFamilyMember().getGlobalId());
            } else {
                existRelative = null;
            }

            Patient managedPatient;
            if (existingPatient != null) {
                // Patient already exists in target tenant, use it directly
                managedPatient = existingPatient;
                log.info("Using existing patient in tenant {}. GlobalPatientId: {}", targetTenant,
                        appointmentDto.getPatient().getGlobalPatientId());
            } else {
                // Patient doesn't exist in target tenant, create new one
                managedPatient = Patient.fromDto(new PatientDto(appointmentDto.getPatient()));
                managedPatient.setBranch(branchReference);
                managedPatient = patientRepository.save(managedPatient);
                log.info("Created new patient in tenant {}. GlobalPatientId: {}", targetTenant,
                        appointmentDto.getPatient().getGlobalPatientId());
            }

            RelationWith manageRelative;
            if (existRelative != null) {
                manageRelative = existRelative;
                appointmentDto.setFamilyMember(manageRelative);
                log.info("Using existing patient in tenant {}. GlobalPatientId: {}", targetTenant,
                        appointmentDto.getPatient().getGlobalPatientId());
            } else {
                if (appointmentDto.getFamilyMember() != null) {
                    manageRelative = RelationWith.fromDto(appointmentDto.getFamilyMember());
                    manageRelative.setPatient(managedPatient);
                    manageRelative = relationWithRepo.save(manageRelative);
                    log.info("Created new patient in tenant {}. GlobalPatientId: {}", targetTenant,
                            appointmentDto.getPatient().getGlobalPatientId());
                    appointmentDto.setFamilyMember(manageRelative);
                }
            }

            // Find existing DoctorBranch by globalDoctorBranchId in target tenant
            Optional<DoctorBranch> existingDoctorBranch = doctorService
                    .findDoctorBranchByGlobalId(appointmentDto.getDoctorBranch().getGlobalDoctorBranchId());

            if (existingDoctorBranch.isEmpty()) {
                throw new EntityNotFoundException("DoctorBranch not found in tenant " + targetTenant
                        + " with globalDoctorBranchId: " + appointmentDto.getDoctorBranch().getGlobalDoctorBranchId());
            }

            DoctorBranch managedDoctorBranch = existingDoctorBranch.get();

            Slot newSlot = appointmentDto.getSlot();

            Slot slot = slotService.slotByGlobalId(appointmentDto.getSlot().getGlobalSlotId());
            slot.setAvailableSlots(slot.getAvailableSlots() - 1);
            slotService.saveOrUpdateSlot(slot);
            appointmentDto.setSlot(slot);

            Appointments appointment;
            if (existingAppointment.isPresent()) {
                appointment = existingAppointment.get();
                appointment.updateFromDto(appointmentDto);

                if (!(newSlot.getGlobalSlotId().equals(existingAppointment.get().getSlot().getGlobalSlotId()))) {
                    Slot existingSlot = existingAppointment.get().getSlot();
                    existingSlot.setStatus(SlotStatus.AVAILABLE);
                    existingSlot.setAvailableSlots(existingSlot.getAvailableSlots() + 1);
                    slotService.saveOrUpdateSlot(existingSlot);
                }

            } else {
                appointment = Appointments.fromDto(appointmentDto);
                // Ensure the globalAppointmentId matches what's in the DTO
                appointment.setSlot(slot);
                appointment.setGlobalAppointmentId(appointmentDto.getGlobalAppointmentId());
            }

            appointment.setPatient(managedPatient);
            appointment.setDoctorBranch(managedDoctorBranch);

            // Save appointment
            appointmentsRepo.save(appointment);
            log.info("Successfully synced appointment to tenant schema: {}. GlobalAppointmentId: {}", targetTenant,
                    appointmentDto.getGlobalAppointmentId());

        } catch (Exception e) {
            Slot slot = slotService.slotByGlobalId(appointmentDto.getSlot().getGlobalSlotId());
            slot.setAvailableSlots(slot.getAvailableSlots() + 1);
            slotService.saveOrUpdateSlot(slot);
            appointmentDto.setSlot(slot);
            log.error(
                    "Error syncing appointment to tenant schema {}. BookingId: '{}', GlobalAppointmentId: {}. Error: {}",
                    targetTenant, appointmentDto.getBookingId(), appointmentDto.getGlobalAppointmentId(),
                    e.getMessage(), e);
            throw new RuntimeException("Failed to sync appointment to tenant schema " + targetTenant
                    + " for GlobalAppointmentId: " + appointmentDto.getGlobalAppointmentId(), e);
        } finally {
            TenantContextHolder.setCurrentTenant(originalTenantContext);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteAppointmentFromMaster(UUID globalAppointmentId, String sourceTenant) {
        String originalTenantContext = TenantContextHolder.getCurrentTenant();
        try {
            TenantContextHolder.setCurrentTenant(defaultTenant);

            Optional<Appointments> appointmentOptional = appointmentsRepo
                    .findByGlobalAppointmentId(globalAppointmentId);

            if (appointmentOptional.isPresent()) {
                appointmentsRepo.delete(appointmentOptional.get());
                log.info("Successfully deleted appointment from master schema. GlobalAppointmentId: {}",
                        globalAppointmentId);
            } else {
                log.warn(
                        "Appointment not found in master schema for deletion (this might be expected). GlobalAppointmentId: {}",
                        globalAppointmentId);
            }

        } catch (Exception e) {
            log.error(
                    "Error deleting appointment from master schema. GlobalAppointmentId: {}, Source tenant: {}. Error: {}",
                    globalAppointmentId, sourceTenant, e.getMessage(), e);
            throw new RuntimeException(
                    "Failed to delete appointment from master schema for GlobalAppointmentId: " + globalAppointmentId,
                    e);
        } finally {
            TenantContextHolder.setCurrentTenant(originalTenantContext);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteAppointmentFromTenant(UUID globalAppointmentId, String targetTenant) {
        String originalTenantContext = TenantContextHolder.getCurrentTenant();
        try {
            TenantContextHolder.setCurrentTenant(targetTenant);

            Optional<Appointments> appointmentOptional = appointmentsRepo
                    .findByGlobalAppointmentId(globalAppointmentId);

            if (appointmentOptional.isPresent()) {
                appointmentsRepo.delete(appointmentOptional.get());
                log.info("Successfully deleted appointment from tenant schema: {}. GlobalAppointmentId: {}",
                        targetTenant, globalAppointmentId);
            } else {
                log.warn(
                        "Appointment not found in tenant schema {} for deletion (this might be expected). GlobalAppointmentId: {}",
                        targetTenant, globalAppointmentId);
            }

        } catch (Exception e) {
            log.error("Error deleting appointment from tenant schema {}. GlobalAppointmentId: {}. Error: {}",
                    targetTenant, globalAppointmentId, e.getMessage(), e);
            throw new RuntimeException("Failed to delete appointment from tenant schema " + targetTenant
                    + " for GlobalAppointmentId: " + globalAppointmentId, e);
        } finally {
            TenantContextHolder.setCurrentTenant(originalTenantContext);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void syncCancelAppointment(AppointmentsDto appointmentDto, String sourceTenant) {
        String originalTenantContext = TenantContextHolder.getCurrentTenant();
        try {
            TenantContextHolder.setCurrentTenant(originalTenantContext);

            // Ensure globalAppointmentId is set
            if (appointmentDto.getGlobalAppointmentId() == null) {
                log.error("AppointmentDto is missing globalAppointmentId. BookingId: {}",
                        appointmentDto.getBookingId());
                throw new IllegalArgumentException("GlobalAppointmentId cannot be null");
            }

            Optional<Appointments> existingAppointment = appointmentsRepo
                    .findByGlobalAppointmentId(appointmentDto.getGlobalAppointmentId());

            Appointments appointment;
            if (existingAppointment.isPresent()) {
                appointment = existingAppointment.get();
                appointment.setCancelReason(appointmentDto.getCancelReason());

                Slot existSlot = existingAppointment.get().getSlot();
                existSlot.setAvailableSlots(existSlot.getAvailableSlots() + 1);
                existSlot.setStatus(SlotStatus.AVAILABLE);
                slotService.saveOrUpdateSlot(existSlot);

            } else {
                throw new RuntimeException("Could not find appointment at :" + sourceTenant + " "
                        + appointmentDto.getGlobalAppointmentId());
            }
            appointmentsRepo.save(appointment);
            log.info("Successfully synced appointment to master schema. GlobalAppointmentId: {}",
                    appointmentDto.getGlobalAppointmentId());
        } catch (Exception e) {
            log.error(
                    "Error syncing appointment to master schema. BookingId: '{}', GlobalAppointmentId: {}, Source tenant: {}. Error: {}",
                    appointmentDto.getBookingId(), appointmentDto.getGlobalAppointmentId(), sourceTenant,
                    e.getMessage(), e);

            throw new RuntimeException("Failed to sync appointment to master schema for GlobalAppointmentId: "
                    + appointmentDto.getGlobalAppointmentId(), e);
        } finally {
            TenantContextHolder.setCurrentTenant(originalTenantContext);
        }
    }

}
