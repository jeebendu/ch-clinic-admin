package com.jee.clinichub.app.doctor.slots.model;

import java.time.LocalTime;
import java.time.temporal.ChronoUnit;

public class SlotUtils {

    public static int getPatientSerial(Slot slot) {
        return slot.getTotalSlots() - slot.getAvailableSlots() + 1;
    }

    public static LocalTime getExpectedAppointmentTime(Slot slot) {
    int serial = getPatientSerial(slot);

    double durationPerPatient;

    if (slot.getDuration() != null && slot.getTotalSlots() > 0) {
        durationPerPatient = slot.getDuration() / (double) slot.getTotalSlots();
    } else {
        long totalMinutes = ChronoUnit.MINUTES.between(slot.getStartTime(), slot.getEndTime());
        durationPerPatient = (double) totalMinutes / slot.getTotalSlots();
    }

    long offsetMinutes = Math.round((serial - 1) * durationPerPatient);
    return slot.getStartTime().plusMinutes(offsetMinutes);
    }
}
