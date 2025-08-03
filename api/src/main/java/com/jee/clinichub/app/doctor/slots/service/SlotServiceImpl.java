package com.jee.clinichub.app.doctor.slots.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
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
import com.jee.clinichub.app.doctor.weeklySchedule.model.DayOfWeek;
import com.jee.clinichub.app.doctor.weeklySchedule.model.WeeklySchedule;
import com.jee.clinichub.app.doctor.weeklySchedule.repository.WeeklyScheduleRepo;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.utility.DateUtility;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class SlotServiceImpl implements SlotService {

    private final SlotRepo slotRepo;
    private final DoctorBranchRepo doctorBranchRepo;
    private final WeeklyScheduleRepo wScheduleRepo;

    @Override
    public List<SlotDto> getAllSlots() {
        return slotRepo.findAll().stream().map(SlotDto::new).toList();
    }

    @Override
    public List<SlotProj> getFilteredSlots(SlotFilter filter) {
        return slotRepo.getFilteredSlots(filter.getDoctorId(), filter.getBranchId(), filter.getDate());
    }

    @Override
    public Status generateSlot(SlotHandler slotHandler) {
        try {
            // IMPROVED: More comprehensive duplicate check
            boolean isSlotExist = slotRepo.existsByDoctorBranch_idAndDateAndStartTimeAndEndTime(
                    slotHandler.getDoctorBranchDto().getId(),
                    slotHandler.getDate(),
                    slotHandler.getStartTime(),
                    slotHandler.getEndTime());

            if (isSlotExist) {
                return new Status(false, "Slot already exists for this time period");
            }

            LocalTime startTime = slotHandler.getStartTime();
            LocalTime endTime = slotHandler.getEndTime();
            long totalMinutes = java.time.Duration.between(startTime, endTime).toMinutes();

            if (slotHandler.getSlotType().equals(SlotType.TIMEWISE)) {
                List<Slot> slots = new ArrayList<>();
                
                if (endTime.isBefore(startTime)) {
                    return new Status(false, "End time should be greater than start time");
                }

                LocalTime currentStart = startTime;
                while (!currentStart.plusMinutes(slotHandler.getSlotDuration()).isAfter(endTime)) {
                    if (totalMinutes < slotHandler.getSlotDuration()) {
                        return new Status(false,
                                "Time gap between start time and end time should be greater than slot duration");
                    }

                    LocalTime currentEnd = currentStart.plusMinutes(slotHandler.getSlotDuration());
                    
                    // IMPROVED: Check each individual time slot for duplicates
                    boolean timeSlotExists = slotRepo.existsByDoctorBranch_idAndDateAndStartTimeAndEndTime(
                            slotHandler.getDoctorBranchDto().getId(),
                            slotHandler.getDate(),
                            currentStart,
                            currentEnd);
                    
                    if (!timeSlotExists) {
                        Slot slot = new Slot();
                        slot.setDoctorBranch(new DoctorBranch(slotHandler.getDoctorBranchDto()));
                        slot.setDate(slotHandler.getDate());
                        slot.setStartTime(currentStart);
                        slot.setSlotType(slotHandler.getSlotType());
                        slot.setEndTime(currentEnd);
                        slot.setAvailableSlots(1);
                        slot.setTotalSlots(1);
                        slot.setStatus(SlotStatus.AVAILABLE);
                        slot.setDuration(slotHandler.getSlotDuration());

                        slots.add(slot);
                    }
                    
                    currentStart = currentStart.plusMinutes(slotHandler.getSlotDuration());
                }
                
                if (!slots.isEmpty()) {
                    slotRepo.saveAll(slots);
                    return new Status(true, "Slot generated successfully. Created " + slots.size() + " slots.");
                } else {
                    return new Status(false, "All slots already exist for this time period");
                }
            } else {
                Slot slot = new Slot();
                slot.setDoctorBranch(new DoctorBranch(slotHandler.getDoctorBranchDto()));
                slot.setDate(slotHandler.getDate());
                slot.setStartTime(slotHandler.getStartTime());
                slot.setEndTime(slotHandler.getEndTime());
                slot.setSlotType(slotHandler.getSlotType());
                slot.setAvailableSlots(slotHandler.getMaxCapacity());
                slot.setTotalSlots(slotHandler.getMaxCapacity());
                slot.setDuration((int) totalMinutes);
                slot.setStatus(SlotStatus.AVAILABLE);
                slotRepo.save(slot);
            }
            
            return new Status(true, "Slot generated successfully");
        } catch (Exception e) {
            log.error("Error generating slot: {}", e.getMessage(), e);
            return new Status(false, "Failed to generate slot: " + e.getMessage());
        }
    }
    
    /**
     * Generate preview/draft slots for the next 7 days based on weekly schedule
     */
    @Transactional
    @Override
    public Status generatePreviewSlots(Long doctorBranchId) {
        try {
            DoctorBranch doctorBranch = doctorBranchRepo.findById(doctorBranchId)
                    .orElseThrow(() -> new EntityNotFoundException("Doctor Branch not found with ID: " + doctorBranchId));

            // Get active weekly schedules for this doctor branch
            List<WeeklySchedule> activeSchedules = wScheduleRepo.findAllByDoctorBranch_idAndActive(doctorBranchId, true);
            
            if (activeSchedules.isEmpty()) {
                return new Status(true, "No active schedules found to generate slots");
            }

            List<Slot> previewSlots = new ArrayList<>();
            LocalDate currentDate = LocalDate.now();
            
            // Generate slots for next 7 days
            for (int i = 0; i < 7; i++) {
            	LocalDate targetDate = currentDate.plusDays(i);
            	java.time.DayOfWeek systemDayOfWeek = targetDate.getDayOfWeek();

            	// Convert "MONDAY" → "Monday"
            	String customEnumDay = systemDayOfWeek.name().charAt(0) + systemDayOfWeek.name().substring(1).toLowerCase();

            	// Match with your custom enum
            	DayOfWeek matchedEnum = DayOfWeek.valueOf(customEnumDay);

            	WeeklySchedule daySchedule = activeSchedules.stream()
            	    .filter(schedule -> schedule.getDayOfWeek() == matchedEnum)
            	    .findFirst()
            	    .orElse(null);

                if (daySchedule != null && daySchedule.getTimeRanges() != null && !daySchedule.getTimeRanges().isEmpty()) {
                    for (DoctorTimeRange timeRange : daySchedule.getTimeRanges()) {
                        try {
                            // Assuming timeRange.getStartTime() returns a string like "09:00"
                            LocalTime startTime = timeRange.getStartTime();
                            LocalTime endTime = timeRange.getEndTime();

                            int slotDurationMinutes = timeRange != null  ? timeRange.getSlotDuration() : 15;

                            LocalTime currentSlotTime = startTime;
                            while (!currentSlotTime.plusMinutes(slotDurationMinutes).isAfter(endTime)) {
                                Slot slot = new Slot();
                                slot.setDoctorBranch(doctorBranch);
                                slot.setDate(java.sql.Date.valueOf(targetDate));
                                slot.setStartTime(currentSlotTime);
                                slot.setEndTime(currentSlotTime.plusMinutes(slotDurationMinutes));
                                slot.setSlotType(SlotType.TIMEWISE);
                                slot.setAvailableSlots(1);
                                slot.setTotalSlots(1);
                                slot.setStatus(SlotStatus.PENDING); // Draft/Preview status
                                slot.setDuration(slotDurationMinutes);

                                previewSlots.add(slot);
                                currentSlotTime = currentSlotTime.plusMinutes(slotDurationMinutes);
                            }
                        } catch (Exception e) {
                            log.error("Error generating slots for time range: {}", e.getMessage(), e);
                        }
                    }
                }
            }
            
            if (!previewSlots.isEmpty()) {
                saveAllSlot(previewSlots);
                log.info("Generated {} preview slots for doctor branch ID: {}", previewSlots.size(), doctorBranchId);
            }
            
            return new Status(true, "Preview slots generated successfully");
            
        } catch (Exception e) {
            log.error("Error generating preview slots: {}", e.getMessage(), e);
            return new Status(false, "Failed to generate preview slots: " + e.getMessage());
        }
    }
    
    @Override
	public List<Slot> getSlotsByDoctorBranchId(Long doctorBranchId, String date) {
		
        try {
            // Get current date for filtering
            Date date_ = DateUtility.stringToDate(date,"yyyy-MM-dd");
            
            // Use SlotHandler to get filtered slots for the doctor branch
            SlotHandler slotHandler = new SlotHandler();
            slotHandler.setDoctorBranchDto(new com.jee.clinichub.app.doctor.model.DoctorBranchDto());
            slotHandler.getDoctorBranchDto().setId(doctorBranchId);
            slotHandler.setDate(date_);
            
            // Get filtered slots from SlotService
            List<SlotDto> slotDtos = getFilteredSlots(slotHandler);
            
            // Convert SlotDto to Slot entities
            List<Slot> slots = new ArrayList<>();
            for (SlotDto slotDto : slotDtos) {
                Slot slot = new Slot();
                slot.setId(slotDto.getId());
                slot.setDate(slotDto.getDate());
                slot.setStartTime(slotDto.getStartTime());
                slot.setEndTime(slotDto.getEndTime());
                slot.setDuration(slotDto.getDuration());
                slot.setAvailableSlots(slotDto.getAvailableSlots());
                slot.setTotalSlots(slotDto.getTotalSlots());
                slot.setStatus(slotDto.getStatus());
                slot.setSlotType(slotDto.getSlotType());
                slot.setGlobalSlotId(slotDto.getGlobalSlotId());
                
                // Set doctor branch
                DoctorBranch doctorBranch = new DoctorBranch();
                if (slotDto.getDoctorBranch() != null) {
                    doctorBranch.setId(slotDto.getDoctorBranch().getId());
                    slot.setDoctorBranch(doctorBranch);
                }
                
                slots.add(slot);
            }
            
            return slots;
        } catch (Exception e) {
            log.error("Error fetching slots for doctor branch ID {}: {}", doctorBranchId, e.getMessage());
            return new ArrayList<>();
        }
    }



    @Override
    public Status deleteById(Long id) {
        slotRepo.findById(id).ifPresentOrElse((slotRepo::delete), () -> {
            throw new EntityNotFoundException("Slot with id '" + id + "' not found");
        });
        return new Status(true, "Slot deleted successfully");
    }

    @Override
    public List<SlotDto> getFilteredSlots(SlotHandler slotHandler) {
        try {
            List<Slot> slots = slotRepo.findAllByDoctorBranch_idAndDate(
                    slotHandler.getDoctorBranchDto().getId(),
                    slotHandler.getDate());

            return slots.stream().map(SlotDto::new).toList();
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Status saveAllSlot(List<Slot> slotList) {
        try {
            slotRepo.saveAll(slotList);
            return new Status(true, "Saved successfully");
        } catch (Exception e) {
            return new Status(false, "Something went wrong");
        }
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<UUID> slotByGlobalIdIn(List<UUID> globalSlotIds) {
        return slotRepo.findAllByGlobalSlotIdIn(globalSlotIds)
                .stream()
                .map(Slot::getGlobalSlotId)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Slot slotByGlobalId(UUID globalId) {
        return slotRepo.findAllByGlobalSlotId(globalId).get();
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Status saveOrUpdateSlot(Slot slot) {
        try {
            if (slot.getId() == null) {
                slot.setStatus(SlotStatus.AVAILABLE);
                slot.setAvailableSlots(slot.getAvailableSlots()!=0?slot.getAvailableSlots():1);
            }
            slotRepo.save(slot);
            return new Status(true, "Slot saved successfully");
        } catch (Exception e) {
            return new Status(false, "Something went wrong while saving slot");
        }
    }

    @Override
    public List<SlotDto> getSlotsByDoctorBranchIdAndDate(Long doctorBranchId, String date) {
        try {
            if (date == null || date.isEmpty()) {
                // If no date provided, return slots for today
                Date today = new Date();
                List<Slot> slots = slotRepo.findAllByDoctorBranch_idAndDate(doctorBranchId, today);
                return slots.stream().map(SlotDto::new).collect(Collectors.toList());
            } else {
                // Parse the date string (expected format: yyyy-MM-dd)
                LocalDate localDate = LocalDate.parse(date, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                Date targetDate = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
                
                List<Slot> slots = slotRepo.findAllByDoctorBranch_idAndDate(doctorBranchId, targetDate);
                return slots.stream().map(SlotDto::new).collect(Collectors.toList());
            }
        } catch (Exception e) {
            log.error("Error fetching slots: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    @Override
    @Transactional
    public Status cleanupPendingSlots(Long doctorBranchId, Date startDate, Date endDate) {
        try {
            slotRepo.deletePendingSlotsByDoctorBranchAndDateRange(doctorBranchId, startDate, endDate);
            return new Status(true, "Cleanup completed successfully");
        } catch (Exception e) {
            log.error("Error during cleanup: {}", e.getMessage(), e);
            return new Status(false, "Cleanup failed");
        }
    }
}
