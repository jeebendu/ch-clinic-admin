
package com.jee.clinichub.config.schedule;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.jee.clinichub.app.admin.clinic.clinicHoliday.repository.ClinicHolidayRepo;
import com.jee.clinichub.app.doctor.doctorLeave.repository.DoctorLeaveRepo;
import com.jee.clinichub.app.doctor.model.DoctorBranch;
import com.jee.clinichub.app.doctor.repository.DoctorBranchRepo;
import com.jee.clinichub.app.doctor.scheduleBreak.model.ScheduleBreak;
import com.jee.clinichub.app.doctor.scheduleBreak.repository.ScheduleBreakRepo;
import com.jee.clinichub.app.doctor.service.DoctorService;
import com.jee.clinichub.app.doctor.slots.model.Slot;
import com.jee.clinichub.app.doctor.slots.model.SlotStatus;
import com.jee.clinichub.app.doctor.slots.model.SlotType;
import com.jee.clinichub.app.doctor.slots.repository.SlotRepo;
import com.jee.clinichub.app.doctor.slots.service.DoctorSlotSyncService;
import com.jee.clinichub.app.doctor.timeRange.model.DoctorTimeRange;
import com.jee.clinichub.app.doctor.weeklySchedule.model.WeeklySchedule;
import com.jee.clinichub.app.doctor.weeklySchedule.service.WeeklyScheduleService;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;
import com.jee.clinichub.global.tenant.repository.TenantRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RequiredArgsConstructor
@Service
@Log4j2
public class DoctorSlotSchedulerSync {

    @Value("${app.default-tenant}")
    private String defaultTenant;

    private final WeeklyScheduleService wScheduleService;
    private final DoctorLeaveRepo leaveRepo;
    private final ClinicHolidayRepo holidayRepo;
    private final ScheduleBreakRepo breakRepo;
    private final DoctorBranchRepo doctorBranchRepo;
    private final SlotRepo slotRepo;
    private final DoctorSlotSyncService doctorSlotSyncService;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void generateSlots(String targetTenant) {

        String originalTenantContext = TenantContextHolder.getCurrentTenant();
        try {

            TenantContextHolder.setCurrentTenant(targetTenant);
            log.info(TenantContextHolder.getCurrentTenant());

            LocalDate today = LocalDate.now();
            LocalDate endDate = today.plusDays(7); // Default 7 days

            List<WeeklySchedule> availabilities = wScheduleService.findAllByActive(true);
            log.info("Availability schedule " + availabilities.size());

            // LocalTime releaseTime = null;

            // if (!availabilities.isEmpty()) {
            // int releaseBefore = availabilities.get(0).getReleaseBefore();
            // endDate = today.plusDays(releaseBefore);
            // releaseTime = availabilities.get(0).getReleaseTime();
            // }

            // Check releaseTime against current time
            // if (releaseTime != null) {
            // LocalTime now = LocalTime.now();
            // long minutesDiff = Math.abs(Duration.between(now, releaseTime).toMinutes());

            // log.info("Current time: {}, Release time: {}, Difference in minutes: {}",
            // now, releaseTime,
            // minutesDiff);

            // if (minutesDiff > 5) {
            // log.info("Skipping slot generation: releaseTime is not within 5 minute of
            // current time.");
            // return; // If not equal or within one minute, return
            // }
            // }

            log.info("Starting slot generation process from {} to {}", today, endDate);

            for (WeeklySchedule availability : availabilities) {
                for (LocalDate date = today; !date.isAfter(endDate); date = date.plusDays(1)) {

                    if (!date.getDayOfWeek().name().equalsIgnoreCase(availability.getDayOfWeek().toString()))
                        continue;

                    log.debug("Processing date: {} for doctor: {} at branch: {}",
                            date, availability.getDoctorBranch().getDoctor().getId(),
                            availability.getDoctorBranch().getBranch().getId());

                    // Skip if doctor is on leave
                    Date dateValue = Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant());
                    boolean onLeave = leaveRepo
                            .existsByDoctorBranch_idAndLeaveStartLessThanEqualAndLeaveEndGreaterThanEqual(
                                    availability.getDoctorBranch().getId(), dateValue, dateValue);
                    if (onLeave) {
                        log.info("Doctor is on leave on {}", date);
                        continue;
                    }

                    // Skip if clinic is on holiday
                    boolean isHoliday = holidayRepo.existsByBranch_idAndDate(
                            availability.getDoctorBranch().getBranch().getId(), dateValue);
                    if (isHoliday) {
                        log.info("Clinic is on holiday on {}", date);
                        continue;
                    }

                    // Get all breaks for this doctor on this day
                    List<ScheduleBreak> breaks = breakRepo.findAllByDoctorBranch_idAndDayOfWeek(
                            availability.getDoctorBranch().getId(), availability.getDayOfWeek());

                    log.debug("Found {} breaks for doctor {} on {}", breaks.size(),
                            availability.getDoctorBranch().getDoctor().getId(), availability.getDayOfWeek());

                    generateSlotsForDate(availability, date, breaks);
                    log.info("Slots generated for doctor {} on {}", availability.getDoctorBranch().getDoctor().getId(),
                            date);
                }
            }

            log.info("Slot created at the tenant completed.");
        } catch (Exception e) {
            throw new RuntimeException("Failed to create slot at tenant");
        } finally {
            TenantContextHolder.setCurrentTenant(originalTenantContext);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    private void generateSlotsForDate(WeeklySchedule availability, LocalDate date, List<ScheduleBreak> breaks) {
        log.debug("Starting slot generation for Doctor ID: {}, Branch ID: {}, Date: {}",
                availability.getDoctorBranch().getDoctor().getId(), availability.getDoctorBranch().getBranch().getId(),
                date);

        Optional<DoctorBranch> optionalDoctorBranch = doctorBranchRepo
                .findById(availability.getDoctorBranch().getId());

        if (optionalDoctorBranch.isEmpty()) {
            log.warn("DoctorBranch not found for Doctor ID: {} and Branch ID: {}. Skipping slot generation.",
                    availability.getDoctorBranch().getDoctor().getId(),
                    availability.getDoctorBranch().getBranch().getId());
            return;
        }

        DoctorBranch doctorBranch = optionalDoctorBranch.get();
        Date dateValue = Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant());

        log.debug("Processing {} time ranges for Doctor ID: {} on {}",
                availability.getTimeRanges().size(), availability.getDoctorBranch().getDoctor().getId(), date);

        for (DoctorTimeRange timeRange : availability.getTimeRanges()) {
            log.debug("Processing time range: {} - {} for slot duration: {} minutes",
                    timeRange.getStartTime(), timeRange.getEndTime(), timeRange.getSlotDuration());

            generateSlotsForTimeRange(timeRange, availability, doctorBranch, dateValue, breaks);
        }

        log.info("Completed slot generation for Doctor ID: {}, Branch ID: {}, Date: {}",
                availability.getDoctorBranch().getDoctor().getId(), availability.getDoctorBranch().getBranch().getId(),
                date);
    }

    private void generateSlotsForTimeRange(DoctorTimeRange timeRange, WeeklySchedule availability,
            DoctorBranch doctorBranch, Date dateValue, List<ScheduleBreak> breaks) {

        LocalTime start = timeRange.getStartTime();
        LocalTime end = timeRange.getEndTime();
        int duration = timeRange.getSlotDuration();
        SlotType slotType = availability.getReleaseType();
        int slotQuantity = timeRange.getSlotQuantity();

        log.debug("Starting slot time range: {} to {} for Doctor ID: {}",
                start, end, availability.getDoctorBranch().getDoctor().getId());

        while (start.isBefore(end)) {
            LocalTime proposedEnd = start.plusMinutes(duration);

            if (proposedEnd.isAfter(end)) {
                proposedEnd = end;
                log.debug("Trimming final slot to fit in end time: {} -> {}", start, proposedEnd);
            }

            final LocalTime currentStart = start;
            final LocalTime currentEnd = proposedEnd;

            List<ScheduleBreak> overlappingBreaks = breaks.stream()
                    .filter(b -> currentStart.isBefore(b.getBreakEnd()) && currentEnd.isAfter(b.getBreakStart()))
                    .toList();

            if (overlappingBreaks.isEmpty()) {
                boolean slotExists = slotRepo.existsByDoctorBranch_idAndDateAndStartTimeAndEndTime(
                        availability.getDoctorBranch().getId(), dateValue,
                        currentStart, currentEnd);

                if (!slotExists) {
                    long actualSlotDuration = Duration.between(currentStart, currentEnd).toMinutes();
                    int capacity = slotType.equals(SlotType.COUNTWISE)
                            ? (int) Math.round((double) slotQuantity * actualSlotDuration / duration)
                            : 1;

                    log.debug("Creating slot: {} to {} | Duration: {} mins | Capacity: {}",
                            currentStart, currentEnd, actualSlotDuration, capacity);

                    createSlot(currentStart, currentEnd, (int) actualSlotDuration,
                            availability, doctorBranch, dateValue, capacity);
                } else {
                    log.debug("Slot already exists for time: {} - {}. Skipping creation.",
                            currentStart, currentEnd);
                }

            } else if (slotType.equals(SlotType.COUNTWISE)) {
                log.debug("Overlapping breaks found for time: {} to {}. Creating split slots.",
                        currentStart, currentEnd);

                createCountwiseSplitSlots(currentStart, currentEnd, availability, doctorBranch, dateValue,
                        overlappingBreaks, slotQuantity);
            }

            start = currentEnd; // Move to next slot
        }

        log.debug("Completed processing for time range: {} to {} on date: {}",
                timeRange.getStartTime(), timeRange.getEndTime(), dateValue);
    }

    private void createCountwiseSplitSlots(LocalTime slotStart, LocalTime slotEnd,
            WeeklySchedule availability, DoctorBranch doctorBranch, Date dateValue,
            List<ScheduleBreak> overlappingBreaks, int totalQuantity) {

        int totalSlotDuration = (int) Duration.between(slotStart, slotEnd).toMinutes();
        LocalTime segmentStart = slotStart;

        for (ScheduleBreak b : overlappingBreaks) {
            LocalTime breakStart = b.getBreakStart();
            LocalTime breakEnd = b.getBreakEnd();

            if (segmentStart.isBefore(breakStart)) {
                LocalTime segmentEnd = breakStart;
                int segmentDuration = (int) Duration.between(segmentStart, segmentEnd).toMinutes();

                if (segmentDuration > 0 && !slotExists(availability, dateValue, segmentStart, segmentEnd)) {
                    int proportionalQuantity = Math.max(1,
                            Math.round((segmentDuration * 1.0f / totalSlotDuration) * totalQuantity));
                    createSlot(segmentStart, segmentEnd, segmentDuration, availability, doctorBranch, dateValue,
                            proportionalQuantity);
                }
            }

            if (breakEnd.isAfter(segmentStart)) {
                segmentStart = breakEnd;
            }
        }

        // Handle final remaining segment after last break
        if (segmentStart.isBefore(slotEnd)) {
            LocalTime segmentEnd = slotEnd;
            int segmentDuration = (int) Duration.between(segmentStart, segmentEnd).toMinutes();

            if (segmentDuration > 0 && !slotExists(availability, dateValue, segmentStart, segmentEnd)) {
                int proportionalQuantity = Math.max(1,
                        Math.round((segmentDuration * 1.0f / totalSlotDuration) * totalQuantity));
                createSlot(segmentStart, segmentEnd, segmentDuration, availability, doctorBranch, dateValue,
                        proportionalQuantity);
            }
        }
    }

    private void createSlot(LocalTime start, LocalTime end, int duration,
            WeeklySchedule availability, DoctorBranch doctorBranch,
            Date dateValue, int quantity) {
        Slot slot = new Slot();
        slot.setDoctorBranch(doctorBranch);
        slot.setDate(dateValue);
        slot.setStartTime(start);
        slot.setEndTime(end);
        slot.setDuration(duration);
        slot.setSlotType(availability.getReleaseType());
        slot.setAvailableSlots(quantity);
        slot.setTotalSlots(quantity);
        slot.setStatus(SlotStatus.AVAILABLE);
        slot.setCreatedBy("admin");

        slotRepo.save(slot);
    }

    private boolean slotExists(WeeklySchedule availability, Date dateValue,
            LocalTime start, LocalTime end) {
        return slotRepo.existsByDoctorBranch_idAndDateAndStartTimeAndEndTime(
                availability.getDoctorBranch().getId(),
                dateValue,
                start,
                end);
    }

    // *********************************************************************

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void releaseSlotToMaster(String targetTenant) {

        String originalTenantContext = TenantContextHolder.getCurrentTenant();
        try {

            TenantContextHolder.setCurrentTenant(targetTenant);
            log.info(TenantContextHolder.getCurrentTenant());

            LocalDate today = LocalDate.now();
            LocalDate endDate = today.plusDays(7); // Default 7 days

            List<WeeklySchedule> availabilities = wScheduleService.findAllByActive(true);
            log.info("Availability schedule " + availabilities.size());
            for (WeeklySchedule availabilityObj : availabilities) {

                LocalTime releaseTime = null;

                int releaseBefore = availabilityObj.getReleaseBefore();
                endDate = today.plusDays(releaseBefore);
                releaseTime = availabilityObj.getReleaseTime();

                // Check releaseTime against current time
                if (releaseTime != null) {
                    LocalTime now = LocalTime.now();
                    long minutesDiff = Math.abs(Duration.between(now, releaseTime).toMinutes());

                    log.info("Current time: {}, Release time: {}, Difference in minutes: {}", now, releaseTime,
                            minutesDiff);

                    if (minutesDiff > 5) {
                        log.info("Skipping slot generation: releaseTime is not within 5 minute of current time.");
                        return; // If not equal or within one minute, return
                    }
                }

                DoctorBranch drBranchObj = doctorBranchRepo.findById(availabilityObj.getDoctorBranch().getId())
                        .orElseThrow(() -> new EntityNotFoundException("DoctorBranch not found with ID: "
                                + availabilityObj.getDoctorBranch().getId()));

                for (LocalDate date = today; !date.isAfter(endDate); date = date.plusDays(1)) {
                    log.info("Syncing slots to master for globalDoctorBranchId: {}",
                            drBranchObj.getGlobalDoctorBranchId());
                    doctorSlotSyncService.syncSlotToMaster(drBranchObj.getGlobalDoctorBranchId(), date);
                }

            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to sync slots to master schema");
        } finally {
            TenantContextHolder.setCurrentTenant(originalTenantContext);
        }
    }
}