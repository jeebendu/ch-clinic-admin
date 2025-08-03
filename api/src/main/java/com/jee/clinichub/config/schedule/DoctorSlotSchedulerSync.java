
package com.jee.clinichub.config.schedule;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jee.clinichub.app.doctor.slotReleaseRules.model.DoctorSlotReleaseRule;
import com.jee.clinichub.app.doctor.slotReleaseRules.service.DoctorSlotReleaseRuleService;
import com.jee.clinichub.app.doctor.slots.model.Slot;
import com.jee.clinichub.app.doctor.slots.model.SlotStatus;
import com.jee.clinichub.app.doctor.slots.repository.SlotRepo;
import com.jee.clinichub.app.doctor.slots.service.DoctorSlotSyncService;
import com.jee.clinichub.app.doctor.weeklySchedule.model.WeeklySchedule;
import com.jee.clinichub.app.doctor.weeklySchedule.service.WeeklyScheduleService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class DoctorSlotSchedulerSync {

    private final WeeklyScheduleService weeklyScheduleService;
    private final DoctorSlotReleaseRuleService releaseRuleService;
    private final SlotRepo slotRepository;
    private final DoctorSlotSyncService slotSyncService;

    @Transactional
    public void generateSlots(String clientId) {
        log.info("Starting slot generation for tenant: {}", clientId);
        
        try {
            List<WeeklySchedule> activeSchedules = weeklyScheduleService.findAllByActive(true);
            LocalDate today = LocalDate.now();
            
            for (WeeklySchedule schedule : activeSchedules) {
                generateSlotsForSchedule(schedule, today);
            }
            
            log.info("Completed slot generation for tenant: {}", clientId);
        } catch (Exception e) {
            log.error("Error generating slots for tenant {}: {}", clientId, e.getMessage(), e);
            throw new RuntimeException("Failed to generate slots for tenant: " + clientId, e);
        }
    }

    @Transactional
    public void releaseSlotToMaster(String clientId) {
        log.info("Starting slot release to master for tenant: {}", clientId);
        
        try {
            // Find pending slots that should be released
            LocalDate today = LocalDate.now();
            LocalDate endDate = today.plusDays(30); // Release slots for next 30 days
            
            List<Slot> pendingSlots = slotRepository.findPendingSlotsInDateRange(
                Date.from(today.atStartOfDay(ZoneId.systemDefault()).toInstant()),
                Date.from(endDate.atStartOfDay(ZoneId.systemDefault()).toInstant())
            );
            
            for (Slot slot : pendingSlots) {
                processSlotRelease(slot);
            }
            
            log.info("Completed slot release to master for tenant: {}", clientId);
        } catch (Exception e) {
            log.error("Error releasing slots to master for tenant {}: {}", clientId, e.getMessage(), e);
            throw new RuntimeException("Failed to release slots to master for tenant: " + clientId, e);
        }
    }

    private void generateSlotsForSchedule(WeeklySchedule schedule, LocalDate startDate) {
        // Generate slots for the next 30 days
        LocalDate endDate = startDate.plusDays(30);
        
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            if (isScheduleActiveForDate(schedule, date)) {
                generateSlotsForDate(schedule, date);
            }
        }
    }

    private boolean isScheduleActiveForDate(WeeklySchedule schedule, LocalDate date) {
        return schedule.getDayOfWeek().name().equalsIgnoreCase(date.getDayOfWeek().name());
    }

    private void generateSlotsForDate(WeeklySchedule schedule, LocalDate date) {
        if (schedule.getTimeRanges() == null || schedule.getTimeRanges().isEmpty()) {
            return;
        }
        
        Date slotDate = Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant());
        
        schedule.getTimeRanges().forEach(timeRange -> {
            LocalTime start = timeRange.getStartTime();
            LocalTime end = timeRange.getEndTime();
            int duration = timeRange.getSlotDuration();
            
            while (!start.plusMinutes(duration).isAfter(end)) {
                // Check if slot already exists
                boolean exists = slotRepository.existsByDoctorBranch_idAndDateAndStartTimeAndEndTime(
                    schedule.getDoctorBranch().getId(),
                    slotDate,
                    start,
                    start.plusMinutes(duration)
                );
                
                if (!exists) {
                    createSlot(schedule, date, start, start.plusMinutes(duration), timeRange.getId());
                }
                
                start = start.plusMinutes(duration);
            }
        });
    }

    private void createSlot(WeeklySchedule schedule, LocalDate date, LocalTime startTime, LocalTime endTime, Long timeRangeId) {
        try {
            // Determine initial status based on release rules
            DoctorSlotReleaseRule rule = releaseRuleService.resolveReleaseRule(
                schedule.getDoctorBranch().getId(), 
                date, 
                startTime, 
                timeRangeId
            );
            
            SlotStatus initialStatus = SlotStatus.PENDING;
            if (rule != null && releaseRuleService.shouldReleaseSlot(rule, date, startTime)) {
                initialStatus = SlotStatus.AVAILABLE;
            }
            
            Slot slot = new Slot();
            slot.setDoctorBranch(schedule.getDoctorBranch());
            slot.setDate(Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant()));
            slot.setStartTime(startTime);
            slot.setEndTime(endTime);
            slot.setDuration((int) java.time.Duration.between(startTime, endTime).toMinutes());
            slot.setStatus(initialStatus);
            slot.setAvailableSlots(1);
            slot.setTotalSlots(1);
            
            slotRepository.save(slot);
            log.debug("Created slot for doctor {} on {} at {}", 
                schedule.getDoctorBranch().getDoctor().getFirstname(), date, startTime);
                
        } catch (Exception e) {
            log.error("Error creating slot: {}", e.getMessage(), e);
        }
    }

    private void processSlotRelease(Slot slot) {
        try {
            LocalDate slotDate = slot.getDate().toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
                
            DoctorSlotReleaseRule rule = releaseRuleService.resolveReleaseRule(
                slot.getDoctorBranch().getId(),
                slotDate,
                slot.getStartTime(),
                null // We'd need to link slots to time ranges for this
            );
            
            if (rule != null && releaseRuleService.shouldReleaseSlot(rule, slotDate, slot.getStartTime())) {
                slot.setStatus(SlotStatus.AVAILABLE);
                slotRepository.save(slot);
                
                // Sync to master
                slotSyncService.syncSlotToMaster(
                    slot.getDoctorBranch().getGlobalDoctorBranchId(),
                    slotDate
                );
                
                log.debug("Released slot for doctor {} on {} at {}", 
                    slot.getDoctorBranch().getDoctor().getFirstname(), 
                    slotDate, 
                    slot.getStartTime()
                );
            }
            
        } catch (Exception e) {
            log.error("Error processing slot release: {}", e.getMessage(), e);
        }
    }
}
