package com.jee.clinichub.app.appointment.appointments.controller;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.appointment.appointments.model.AppointmentFilter;
import com.jee.clinichub.app.appointment.appointments.model.AppointmentSearch;
import com.jee.clinichub.app.appointment.appointments.model.Appointments;
import com.jee.clinichub.app.appointment.appointments.model.AppointmentsDto;
import com.jee.clinichub.app.appointment.appointments.model.AppointmentsProj;
import com.jee.clinichub.app.appointment.appointments.model.StatusUpdate;
import com.jee.clinichub.app.appointment.appointments.service.AppointmentsService;
import com.jee.clinichub.app.doctor.model.Doctor;
import com.jee.clinichub.app.doctor.model.DoctorDto;
import com.jee.clinichub.app.doctor.model.DoctorWithOutBranchProj;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.global.model.Status;
import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/appointments")
public class AppointmentsController {

    @Autowired
    private AppointmentsService appointmentsService;

    @GetMapping(value = "/list")
    public List<AppointmentsDto> getAllAppointments() {
        return appointmentsService.getAllAppointments();
    }

    @GetMapping(value = "/id/{id}")
    public AppointmentsDto getAppointmentById(@PathVariable Long id) {
        return appointmentsService.getById(id);
    }

    @PostMapping(value = "/status/id/{id}")
    public Status updateStatus(@RequestBody StatusUpdate status, @PathVariable Long id) {
        return appointmentsService.updateStatus(id, status);
    }

    @CacheEvict(value = "appointmentsCache", allEntries = true, keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value = "/saveOrUpdate")
    @ResponseBody
    public Appointments saveRequest(@RequestBody @Valid AppointmentsDto appointment, Errors errors) {
        return appointmentsService.saveOrUpdate(appointment);
    }

    @CacheEvict(value = "appointmentsCache", allEntries = true, keyGenerator = "multiTenantCacheKeyGenerator")
    @DeleteMapping(value = "/delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
        return appointmentsService.deleteById(id);
    }

    @CacheEvict(value = "appointmentsCache", allEntries = true, keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value = "/filter/{pageNo}/{pageSize}")
    public Page<AppointmentsProj> search(@RequestBody AppointmentSearch search, @PathVariable int pageNo,
            @PathVariable int pageSize) {
        return appointmentsService.search(search, pageNo, pageSize);
    }

    @GetMapping(value = "/patient/appointments/{name}")
    public List<AppointmentsProj> getAppointmentsForPatient(@PathVariable String name) {
        Date currentDate = new Date();
        return appointmentsService.getAppointmentsForPatient(name, currentDate);
    }

    @GetMapping(value = "/patient-appointments/filter")
    public Page<AppointmentsProj> filterPatientAppointment(Pageable pageble) {
        Date currentDate = new Date();
        return appointmentsService.filterPatientAppointment(pageble, currentDate);
    }

    @PostMapping(value = "/doctor/{id}")
    public Page<AppointmentsProj> getAppointmentsByDrID(Pageable pageable, @PathVariable Long id,
            @RequestBody AppointmentFilter filter) {
        return appointmentsService.getAppointmentsByDrID(pageable, id, filter);
    }

    @PostMapping(value = "/clinic")
    public Page<AppointmentsProj> appointmentForClinicBranch(Pageable pageable, @RequestBody AppointmentFilter filter) {
        return appointmentsService.appointmentForClinicBranch(pageable, filter);
    }

    @PostMapping(value = "/patients/doctor/{id}")
    public Page<Patient> patientListByDrId(Pageable pageable, @PathVariable Long id,
            @RequestBody AppointmentFilter filter) {
        return appointmentsService.patientListByDrId(pageable, id, filter);
    }

    @GetMapping(value = "/doctor/list")
    public List<DoctorDto> findAllDoctorList() {
        return appointmentsService.findAllDoctorList();
    }

    @PostMapping(value = "/updateStatusToCancelled")
    public Status updateStatusToCancelled(@RequestBody AppointmentsDto appointmentsDto) {
        return appointmentsService.updateStatusToCancelled(appointmentsDto);
    }

    @GetMapping("/download/id/{id}")
    public byte[] downloadAppointment(@PathVariable Long id) {
        return appointmentsService.downloadAppointment(id);
    }

    @GetMapping(value = "/is-client/doctor/{doctorId}/patient/{patientId}")
    public boolean ispatientTakenService(@PathVariable Long doctorId, @PathVariable Long patientId) {
        return appointmentsService.ispatientTakenService(doctorId, patientId);
    }

    @PostMapping(value = "/is-appointment-taken")
    public Status isTakenTodayAppointment(@RequestBody AppointmentsDto appointmentsDto) {
        return appointmentsService.isTakenTodayAppointment(appointmentsDto);
    }

    @PostMapping(value = "/reschedule-appointment")
    public Appointments rescheduleAppointment(@RequestBody AppointmentsDto appointmentsDto) {
        return appointmentsService.rescheduleAppointment(appointmentsDto);
    }

    @GetMapping(value = "/checkedin-appointment/id/{id}")
    public Status checkedInAppointment(@PathVariable Long id) {
        return appointmentsService.checkedInAppointment(id);
    }
}
