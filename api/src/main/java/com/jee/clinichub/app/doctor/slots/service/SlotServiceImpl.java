package com.jee.clinichub.app.doctor.slots.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jee.clinichub.app.doctor.model.DoctorBranch;
import com.jee.clinichub.app.doctor.repository.DoctorBranchRepo;
import com.jee.clinichub.app.doctor.slots.model.Slot;
import com.jee.clinichub.app.doctor.slots.model.SlotDto;
import com.jee.clinichub.app.doctor.slots.model.SlotFilter;
import com.jee.clinichub.app.doctor.slots.model.SlotHandler;
import com.jee.clinichub.app.doctor.slots.model.SlotProj;
import com.jee.clinichub.app.doctor.slots.model.SlotStatus;
import com.jee.clinichub.app.doctor.slots.model.SlotType;
import com.jee.clinichub.app.doctor.slots.repository.SlotRepo;
import com.jee.clinichub.app.doctor.timeRange.model.DoctorTimeRange;
import com.jee.clinichub.app.doctor.weeklySchedule.model.WeeklySchedule;
import com.jee.clinichub.app.doctor.weeklySchedule.repository.WeeklyScheduleRepo;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class SlotServiceImpl implements SlotService {

    @Autowired
    private SlotRepo slotRepo;

    @Autowired
    private DoctorBranchRepo doctorBranchRepo;

    @Autowired
    private WeeklyScheduleRepo weeklyScheduleRepo;

    @Override
    public List<SlotDto> getAllSlots() {
        return slotRepo.findAll().stream().map(SlotDto::new).toList();
    }

    @Override
    public List<SlotProj> getFilteredSlots(SlotFilter filter) {
        return slotRepo.getFilteredSlots(filter.getDoctorId(), filter.getBranchId(), filter.getDate());
    }

    @Override
    public Status deleteById(Long id) {
        try {
            slotRepo.findById(id).ifPresentOrElse(
                    slot -> {
                        slotRepo.deleteById(id);
                    },
                    () -> {
                        throw new EntityNotFoundException("Slot not found with ID: " + id);
                    }
            );
            return new Status(true, "Deleted Successfully");
        } catch (Exception e) {
            log.error("Error deleting slot: {}", e.getMessage(), e);
            return new Status(false, "Failed to delete slot");
        }
    }

    @Override
    public List<SlotDto> getFilteredSlots(SlotHandler slotHandler) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getFilteredSlots'");
    }

    @Override
    public Status saveAllSlot(List<Slot> slotList) {
        try {
            slotRepo.saveAll(slotList);
            return new Status(true, "Slots saved successfully");
        } catch (Exception e) {
            log.error("Error saving slots: {}", e.getMessage(), e);
            return new Status(false, "Failed to save slots: " + e.getMessage());
        }
    }

    @Override
    public List<UUID> slotByGlobalIdIn(List<UUID> globalSlotIds) {
        return slotRepo.findAllByGlobalSlotIdIn(globalSlotIds).stream().map(Slot::getGlobalSlotId).toList();
    }

    @Override
    public Slot slotByGlobalId(UUID globalId) {
        return slotRepo.findAllByGlobalSlotId(globalId).orElse(null);
    }

    @Override
    public Status saveOrUpdateSlot(Slot slot) {
        try {
            slotRepo.save(slot);
            return new Status(true, "Slot saved successfully");
        } catch (Exception e) {
            log.error("Error saving slot: {}", e.getMessage(), e);
            return new Status(false, "Failed to save slot: " + e.getMessage());
        }
    }

    @Override
    public List<SlotDto> getSlotsByDoctorBranchIdAndDate(Long doctorBranchId, String date) {
        Date dateValue = java.sql.Date.valueOf(date);
        return slotRepo.findAllByDoctorBranch_idAndDate(doctorBranchId, dateValue).stream().map(SlotDto::new).toList();
    }

    @Override
    public List<Slot> getSlotsByDoctorBranchId(Long doctorBranchId, String date) {
		Date dateValue = java.sql.Date.valueOf(date);
        return slotRepo.findAllByDoctorBranch_idAndDate(doctorBranchId, dateValue);
	}

	

	@Override
    @Transactional
    public Status generateSlot(SlotHandler slotHandler) {
        try {
            DoctorBranch doctorBranch = doctorBranchRepo.findById(slotHandler.getDoctorBranchDto().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Doctor Branch not found"));

            List<Slot> slotsToSave = new ArrayList<>();
            LocalTime currentStart = slotHandler.getStartTime();
            LocalTime endTime = slotHandler.getEndTime();

            if (slotHandler.getSlotType() == SlotType.TIMEWISE) {
                while (currentStart.isBefore(endTime)) {
                    LocalTime currentEnd = currentStart.plusMinutes(slotHandler.getSlotDuration());
                    
                    if (currentEnd.isAfter(endTime)) {
                        break;
                    }

                    // Use extracted duplicate checking method
                    if (!isDuplicateSlot(slotHandler.getDoctorBranchDto().getId(), slotHandler.getDate(), currentStart, currentEnd)) {
                        Slot slot = createSlotFromHandler(slotHandler, doctorBranch, currentStart, currentEnd);
                        slotsToSave.add(slot);
                    } else {
                        log.warn("Duplicate slot found for time {} - {}, skipping", currentStart, currentEnd);
                    }

                    currentStart = currentEnd;
                }
            } else if (slotHandler.getSlotType() == SlotType.COUNTWISE) {
                // Use extracted duplicate checking method
                if (!isDuplicateSlot(slotHandler.getDoctorBranchDto().getId(), slotHandler.getDate(), currentStart, endTime)) {
                    Slot slot = createSlotFromHandler(slotHandler, doctorBranch, currentStart, endTime);
                    slot.setTotalSlots(slotHandler.getMaxCapacity());
                    slot.setAvailableSlots(slotHandler.getMaxCapacity());
                    slotsToSave.add(slot);
                } else {
                    return new Status(false, "Duplicate slot already exists for this time range");
                }
            }

            if (!slotsToSave.isEmpty()) {
                slotRepo.saveAll(slotsToSave);
                return new Status(true, "Slots generated successfully. Total: " + slotsToSave.size());
            } else {
                return new Status(false, "No slots were generated. All slots may already exist.");
            }

        } catch (Exception e) {
            log.error("Error generating slots: {}", e.getMessage(), e);
            return new Status(false, "Failed to generate slots: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public Status generatePreviewSlots(Long doctorBranchId) {
        try {
            DoctorBranch doctorBranch = doctorBranchRepo.findById(doctorBranchId)
                    .orElseThrow(() -> new EntityNotFoundException("Doctor Branch not found with ID: " + doctorBranchId));

            List<WeeklySchedule> activeSchedules = weeklyScheduleRepo.findAllByDoctorBranch_idAndActive(doctorBranchId, true);
            
            if (activeSchedules.isEmpty()) {
                return new Status(false, "No active weekly schedules found for this doctor branch");
            }

            // Clean up existing PENDING slots for the next 30 days
            LocalDate startDate = LocalDate.now();
            LocalDate endDate = startDate.plusDays(30);
            Date startDateObj = Date.from(startDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
            Date endDateObj = Date.from(endDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
            
            slotRepo.deleteSlotsByStatusAndDateRange(doctorBranchId, SlotStatus.PENDING, startDateObj, endDateObj);

            List<Slot> previewSlots = new ArrayList<>();
            
            // Generate slots for next 30 days
            for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
                DayOfWeek dayOfWeek = date.getDayOfWeek();
                com.jee.clinichub.app.doctor.weeklySchedule.model.DayOfWeek scheduleDayOfWeek = mapToDayOfWeek(dayOfWeek);
                
                // Find schedule for this day
                WeeklySchedule daySchedule = activeSchedules.stream()
                        .filter(schedule -> schedule.getDayOfWeek() == scheduleDayOfWeek)
                        .findFirst()
                        .orElse(null);
                
                if (daySchedule != null && daySchedule.getTimeRanges() != null) {
                    Date dateObj = Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant());
                    
                    for (DoctorTimeRange timeRange : daySchedule.getTimeRanges()) {
                        List<Slot> dailySlots = generateDailyPreviewSlots(doctorBranch, dateObj, timeRange);
                        previewSlots.addAll(dailySlots);
                    }
                }
            }

            if (!previewSlots.isEmpty()) {
                slotRepo.saveAll(previewSlots);
                return new Status(true, "Preview slots generated successfully. Total: " + previewSlots.size());
            } else {
                return new Status(false, "No preview slots were generated");
            }

        } catch (Exception e) {
            log.error("Error generating preview slots: {}", e.getMessage(), e);
            return new Status(false, "Failed to generate preview slots: " + e.getMessage());
        }
    }

    /**
     * Extracted duplicate checking logic to be reused by both generateSlot and generatePreviewSlots
     */
    private boolean isDuplicateSlot(Long doctorBranchId, Date date, LocalTime startTime, LocalTime endTime) {
        return slotRepo.existsByDoctorBranch_idAndDateAndStartTimeAndEndTime(doctorBranchId, date, startTime, endTime);
    }

    private List<Slot> generateDailyPreviewSlots(DoctorBranch doctorBranch, Date date, DoctorTimeRange timeRange) {
        List<Slot> slots = new ArrayList<>();
        
        LocalTime currentStart = timeRange.getStartTime();
        LocalTime endTime = timeRange.getEndTime();
        int slotDuration = timeRange.getSlotDuration() != null ? timeRange.getSlotDuration() : 30;
        
        if (timeRange.getSlotType() == SlotType.TIMEWISE) {
            while (currentStart.isBefore(endTime)) {
                LocalTime currentEnd = currentStart.plusMinutes(slotDuration);
                
                if (currentEnd.isAfter(endTime)) {
                    break;
                }

                // Use extracted duplicate checking method
                if (!isDuplicateSlot(doctorBranch.getId(), date, currentStart, currentEnd)) {
                    Slot slot = new Slot();
                    slot.setDoctorBranch(doctorBranch);
                    slot.setDate(date);
                    slot.setStartTime(currentStart);
                    slot.setEndTime(currentEnd);
                    slot.setDuration(slotDuration);
                    slot.setSlotType(SlotType.TIMEWISE);
                    slot.setStatus(SlotStatus.PENDING);
                    slot.setTotalSlots(1);
                    slot.setAvailableSlots(1);
                    slot.setGlobalSlotId(UUID.randomUUID());
                    
                    slots.add(slot);
                } else {
                    log.debug("Skipping duplicate slot for time {} - {} on {}", currentStart, currentEnd, date);
                }

                currentStart = currentEnd;
            }
        } else if (timeRange.getSlotType() == SlotType.COUNTWISE) {
            // Use extracted duplicate checking method
            if (!isDuplicateSlot(doctorBranch.getId(), date, currentStart, endTime)) {
                Slot slot = new Slot();
                slot.setDoctorBranch(doctorBranch);
                slot.setDate(date);
                slot.setStartTime(currentStart);
                slot.setEndTime(endTime);
                slot.setDuration((int) java.time.Duration.between(currentStart, endTime).toMinutes());
                slot.setSlotType(SlotType.COUNTWISE);
                slot.setStatus(SlotStatus.PENDING);
                slot.setTotalSlots(timeRange.getMaxCapacity() != null ? timeRange.getMaxCapacity() : 10);
                slot.setAvailableSlots(timeRange.getMaxCapacity() != null ? timeRange.getMaxCapacity() : 10);
                slot.setGlobalSlotId(UUID.randomUUID());
                
                slots.add(slot);
            } else {
                log.debug("Skipping duplicate COUNTWISE slot for time {} - {} on {}", currentStart, endTime, date);
            }
        }
        
        return slots;
    }

    private Slot createSlotFromHandler(SlotHandler slotHandler, DoctorBranch doctorBranch, LocalTime startTime, LocalTime endTime) {
        Slot slot = new Slot();
        slot.setDoctorBranch(doctorBranch);
        slot.setDate(slotHandler.getDate());
        slot.setStartTime(startTime);
        slot.setEndTime(endTime);
        slot.setDuration(slotHandler.getSlotDuration());
        slot.setSlotType(slotHandler.getSlotType());
        slot.setStatus(SlotStatus.AVAILABLE);
        slot.setTotalSlots(1);
        slot.setAvailableSlots(1);
        slot.setGlobalSlotId(UUID.randomUUID());
        return slot;
    }

    private com.jee.clinichub.app.doctor.weeklySchedule.model.DayOfWeek mapToDayOfWeek(DayOfWeek dayOfWeek) {
        switch (dayOfWeek) {
            case MONDAY: return com.jee.clinichub.app.doctor.weeklySchedule.model.DayOfWeek.MONDAY;
            case TUESDAY: return com.jee.clinichub.app.doctor.weeklySchedule.model.DayOfWeek.TUESDAY;
            case WEDNESDAY: return com.jee.clinichub.app.doctor.weeklySchedule.model.DayOfWeek.WEDNESDAY;
            case THURSDAY: return com.jee.clinichub.app.doctor.weeklySchedule.model.DayOfWeek.THURSDAY;
            case FRIDAY: return com.jee.clinichub.app.doctor.weeklySchedule.model.DayOfWeek.FRIDAY;
            case SATURDAY: return com.jee.clinichub.app.doctor.weeklySchedule.model.DayOfWeek.SATURDAY;
            case SUNDAY: return com.jee.clinichub.app.doctor.weeklySchedule.model.DayOfWeek.SUNDAY;
            default: throw new IllegalArgumentException("Unknown day of week: " + dayOfWeek);
        }
    }

    @Override
    public Page<Slot> getAllSlots(Pageable pageable) {
        return slotRepo.findAll(pageable);
    }
}
