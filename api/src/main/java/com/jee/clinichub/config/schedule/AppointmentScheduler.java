package com.jee.clinichub.config.schedule;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jee.clinichub.app.appointment.appointments.model.AppointmentStatus;
import com.jee.clinichub.app.appointment.appointments.model.Appointments;
import com.jee.clinichub.app.appointment.appointments.repository.AppointmentsRepo;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class AppointmentScheduler {

    private final AppointmentsRepo appointmentsRepo;

    @Scheduled(cron = "0 */5 * * * *")
    @Transactional
    public void generateSlots() {
        LocalDate today = LocalDate.now();
        Date dateValue = Date.from(today.atStartOfDay(ZoneId.systemDefault()).toInstant());

        List<Appointments> appointmentList = appointmentsRepo.findAllBySlot_dateLessThanAndStatus(dateValue,
                AppointmentStatus.UPCOMING);

        List<Appointments> appointmentCnacelList = new ArrayList<>();

        for (Appointments appointmentObj : appointmentList) {
            appointmentObj.setStatus(AppointmentStatus.CANCELLED);
            appointmentCnacelList.add(appointmentObj);
        }
        appointmentsRepo.saveAll(appointmentCnacelList);
    }

}