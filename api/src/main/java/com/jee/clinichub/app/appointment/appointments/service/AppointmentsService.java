package com.jee.clinichub.app.appointment.appointments.service;


import java.util.Date;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

import com.jee.clinichub.app.appointment.appointments.model.AppointmentFilter;
import com.jee.clinichub.app.appointment.appointments.model.AppointmentSearch;
import com.jee.clinichub.app.appointment.appointments.model.Appointments;
import com.jee.clinichub.app.appointment.appointments.model.AppointmentsDto;
import com.jee.clinichub.app.appointment.appointments.model.AppointmentsProj;
import com.jee.clinichub.app.appointment.appointments.model.StatusUpdate;
import com.jee.clinichub.app.doctor.model.Doctor;
import com.jee.clinichub.app.doctor.model.DoctorDto;
import com.jee.clinichub.app.doctor.model.DoctorWithOutBranchProj;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.global.model.Status;


public interface AppointmentsService {

    List<AppointmentsDto> getAllAppointments();

    AppointmentsDto getById(Long id);

    Appointments saveOrUpdate( AppointmentsDto appointment);

    Status deleteById(Long id);

    Status updateStatus(Long id, StatusUpdate statusDto);

    Page<AppointmentsProj> search(AppointmentSearch search, int pageNo, int pageSize);

    List<AppointmentsProj> getAppointmentsForPatient( String name,Date currentTime);
    // Page<AppointmentsProj> search(AppointmentSearch search, int pageNo, int pageSize);
    

    Page<AppointmentsProj> getAppointmentsByDrID(Pageable pageable, Long id,AppointmentFilter filter);

    Page<Patient> patientListByDrId(Pageable pageable, Long id, AppointmentFilter filter);


     Status updateStatusToCancelled(AppointmentsDto appointmentsDto);

      byte[] downloadAppointment(Long id);

     Page<AppointmentsProj> appointmentForClinicBranch(Pageable pageable, AppointmentFilter filter);

     Page<AppointmentsProj> filterPatientAppointment(Pageable pageble, Date currentDate);

     boolean ispatientTakenService(Long doctorId, Long patientId);

	void sendAppointmentConfirmEmail(Appointments appointment, byte[] pdfData);

    Status isTakenTodayAppointment(AppointmentsDto appointmentsDto);

    Appointments rescheduleAppointment(AppointmentsDto appointmentsDto);

    Status checkedInAppointment(Long id);

    List<DoctorDto> findAllDoctorList();
}
