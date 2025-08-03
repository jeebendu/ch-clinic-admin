package com.jee.clinichub.app.doctor.weeklySchedule.service;


import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jee.clinichub.app.doctor.model.DoctorBranch;
import com.jee.clinichub.app.doctor.model.DoctorBranchDto;
import com.jee.clinichub.app.doctor.repository.DoctorBranchRepo;
import com.jee.clinichub.app.doctor.slots.model.Slot;
import com.jee.clinichub.app.doctor.slots.model.SlotDto;
import com.jee.clinichub.app.doctor.slots.model.SlotHandler;
import com.jee.clinichub.app.doctor.slots.model.SlotStatus;
import com.jee.clinichub.app.doctor.slots.model.SlotType;
import com.jee.clinichub.app.doctor.slots.service.SlotService;
import com.jee.clinichub.app.doctor.timeRange.model.DoctorTimeRange;
import com.jee.clinichub.app.doctor.timeRange.repository.DoctorTimeRangeRepository;
import com.jee.clinichub.app.doctor.weeklySchedule.model.DayOfWeek;
import com.jee.clinichub.app.doctor.weeklySchedule.model.WeeklySchedule;
import com.jee.clinichub.app.doctor.weeklySchedule.model.WeeklyScheduleDTO;
import com.jee.clinichub.app.doctor.weeklySchedule.model.WeeklyScheduleWithoutDrBranch;
import com.jee.clinichub.app.doctor.weeklySchedule.repository.WeeklyScheduleRepo;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class WeeklyScheduleServiceImpl implements WeeklyScheduleService {

    @Autowired
    private WeeklyScheduleRepo wScheduleRepo;

    @Autowired
    private DoctorTimeRangeRepository timeRangeRepository;
    @Autowired
    private DoctorBranchRepo doctorBranchRepo;
    
    @Autowired
    private SlotService slotService;

    @Override
    @Transactional
    public Status saveOrUpdate(List<WeeklyScheduleDTO> scheduleDtoList,Long drBranchId) {
        try {
            DoctorBranch doctorBranch = doctorBranchRepo.findById(drBranchId)
                    .orElseThrow(() -> new EntityNotFoundException("Doctor Branch not found with ID: " + drBranchId));

            for (WeeklyScheduleDTO scheduleDto : scheduleDtoList) {
                // Validate time ranges
                if (scheduleDto.isActive() && (scheduleDto.getTimeRanges() == null || scheduleDto.getTimeRanges().isEmpty())) {
                    return new Status(false, "Active schedules must have at least one time range");
                }
                scheduleDto.setDoctorBranch(new DoctorBranchDto(doctorBranch));

                // Check for duplicate day/doctor/branch combination
                boolean isDuplicate = wScheduleRepo.existsByDoctorBranch_idAndDayOfWeekAndIdNot(
                    doctorBranch.getId(),
                    scheduleDto.getDayOfWeek(),
                    scheduleDto.getId() != null ? scheduleDto.getId() : 0L
                );

                if (isDuplicate) {
                    return new Status(false, "Schedule already exists for " + scheduleDto.getDayOfWeek());
                }

                WeeklySchedule schedule;
                if (scheduleDto.getId() != null) {
                    // Update existing
                    schedule = wScheduleRepo.findById(scheduleDto.getId())
                            .orElseThrow(() -> new EntityNotFoundException("Schedule not found with ID: " + scheduleDto.getId()));
                    
                    // Clear existing time ranges
                    timeRangeRepository.deleteByAvailability_Id(schedule.getId());
                    schedule.getTimeRanges().clear();
                    
                    // Update fields
                    updateScheduleFields(schedule, scheduleDto);
                } else {    
                    schedule = new WeeklySchedule(scheduleDto);
                    schedule.setDoctorBranch(doctorBranch);
                }

                wScheduleRepo.save(schedule);
            }

            // Generate preview/draft slots after saving schedule
            generatePreviewSlots(drBranchId);

            return new Status(true, "Weekly schedules saved successfully");
        } catch (Exception e) {
            log.error("Error saving weekly schedules: {}", e.getMessage(), e);
            return new Status(false, "Failed to save weekly schedules: " + e.getMessage());
        }
    }

    /**
     * Generate preview/draft slots for the next 7 days based on weekly schedule
     */
    @Transactional
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
                slotService.saveAllSlot(previewSlots);
                log.info("Generated {} preview slots for doctor branch ID: {}", previewSlots.size(), doctorBranchId);
            }
            
            return new Status(true, "Preview slots generated successfully");
            
        } catch (Exception e) {
            log.error("Error generating preview slots: {}", e.getMessage(), e);
            return new Status(false, "Failed to generate preview slots: " + e.getMessage());
        }
    }

    @Override
    public List<Slot> getSlotsByDoctorBranchId(Long doctorBranchId) {
        try {
            // Get current date for filtering
            LocalDate currentDate = LocalDate.now();
            Date date = Date.from(currentDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
            
            // Use SlotHandler to get filtered slots for the doctor branch
            SlotHandler slotHandler = new SlotHandler();
            slotHandler.setDoctorBranchDto(new com.jee.clinichub.app.doctor.model.DoctorBranchDto());
            slotHandler.getDoctorBranchDto().setId(doctorBranchId);
            slotHandler.setDate(date);
            
            // Get filtered slots from SlotService
            List<SlotDto> slotDtos = slotService.getFilteredSlots(slotHandler);
            
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

    private void updateScheduleFields(WeeklySchedule schedule, WeeklyScheduleDTO dto) {
        schedule.setActive(dto.isActive());
        schedule.setDayOfWeek(dto.getDayOfWeek());
        schedule.setReleaseType(dto.getReleaseType());
        schedule.setReleaseBefore(dto.getReleaseBefore());
        schedule.setReleaseTime(dto.getReleaseTime());

        // Add new time ranges
        if (dto.getTimeRanges() != null) {
            dto.getTimeRanges().forEach(timeRangeDTO -> {
                var timeRange = new com.jee.clinichub.app.doctor.timeRange.model.DoctorTimeRange(timeRangeDTO);
                timeRange.setAvailability(schedule);
                schedule.getTimeRanges().add(timeRange);
            });
        }
    }

    @Override
    public Status deleteById(Long id) {
        try {
            wScheduleRepo.findById(id).ifPresentOrElse(
                schedule -> {
                    wScheduleRepo.deleteById(id);
                },
                () -> {
                    throw new EntityNotFoundException("Schedule not found with ID: " + id);
                }
            );
            return new Status(true, "Deleted Successfully");
        } catch (Exception e) {
            log.error("Error deleting schedule: {}", e.getMessage(), e);
            return new Status(false, "Failed to delete schedule");
        }
    }

    @Override
    public WeeklyScheduleDTO getById(Long id) {
        WeeklySchedule schedule = wScheduleRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Schedule not found with ID: " + id));
        return new WeeklyScheduleDTO(schedule);
    }

    @Override
    public List<WeeklyScheduleDTO> findAll() {
        return wScheduleRepo.findAll().stream()
                .map(WeeklyScheduleDTO::new)
                .toList();
    }

    @Override
    public List<WeeklyScheduleDTO> findAllByBranchId(Long branchId) {
        return wScheduleRepo.findAllByDoctorBranch_branch_id(branchId).stream()
                .map(WeeklyScheduleDTO::new)
                .toList();
    }

    @Override
    public List<WeeklyScheduleDTO> findAllByDoctorId(Long doctorId) {
        return wScheduleRepo.findAllByDoctorBranch_doctor_idAndActive(doctorId, true).stream()
                .map(WeeklyScheduleDTO::new)
                .toList();
    }

    @Override
    public List<WeeklyScheduleDTO> findAllByBranchAndDoctorId(Long branchId, Long doctorId) {
        return wScheduleRepo.findAllByDoctorBranch_branch_idAndDoctorBranch_doctor_idOrderByIdAsc(branchId, doctorId).stream()
                .map(WeeklyScheduleDTO::new)
                .toList();
    }

    @Override
    public List<WeeklySchedule> findAllByActive(boolean active) {
        return wScheduleRepo.findAllByActive(active);
    }

    @Override
    public List<WeeklyScheduleWithoutDrBranch> findAllByDoctorBranchId(Long drBranchId) {
            return wScheduleRepo.findAllByDoctorBranch_idOrderByIdAsc(drBranchId).stream()
                .map(WeeklyScheduleWithoutDrBranch::new)
                .toList();
    }
}
