
package com.jee.clinichub.app.doctor.weeklySchedule.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jee.clinichub.app.doctor.model.DoctorBranch;
import com.jee.clinichub.app.doctor.slots.model.Slot;
import com.jee.clinichub.app.doctor.slots.model.SlotStatus;
import com.jee.clinichub.app.doctor.slots.model.SlotType;
import com.jee.clinichub.app.doctor.slots.repository.SlotRepo;
import com.jee.clinichub.app.doctor.slots.service.SlotService;
import com.jee.clinichub.app.doctor.timeRanges.model.DoctorTimeRange;
import com.jee.clinichub.app.doctor.weeklySchedule.model.WeeklySchedule;
import com.jee.clinichub.app.doctor.weeklySchedule.model.WeeklyScheduleDTO;
import com.jee.clinichub.app.doctor.weeklySchedule.model.WeeklyScheduleWithoutDrBranch;
import com.jee.clinichub.app.doctor.weeklySchedule.repository.WeeklyScheduleRepo;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class WeeklyScheduleServiceImpl implements WeeklyScheduleService {

    private final WeeklyScheduleRepo weeklyScheduleRepo;
    private final SlotRepo slotRepo;
    private final SlotService slotService;

    @Override
    public Status saveOrUpdate(List<WeeklyScheduleDTO> scheduleDtoList, Long drBranchId) {
        try {
            List<WeeklySchedule> schedules = new ArrayList<>();
            for (WeeklyScheduleDTO dto : scheduleDtoList) {
                WeeklySchedule schedule = new WeeklySchedule(dto);
                schedule.setDoctorBranch(new DoctorBranch(drBranchId));
                schedules.add(schedule);
            }
            weeklyScheduleRepo.saveAll(schedules);
            return new Status(true, "Weekly schedule saved successfully");
        } catch (Exception e) {
            log.error("Error saving weekly schedule: {}", e.getMessage(), e);
            return new Status(false, "Failed to save weekly schedule");
        }
    }

    @Override
    public Status deleteById(Long id) {
        try {
            weeklyScheduleRepo.findById(id).ifPresentOrElse(
                weeklyScheduleRepo::delete,
                () -> {
                    throw new EntityNotFoundException("Weekly schedule with id '" + id + "' not found");
                }
            );
            return new Status(true, "Weekly schedule deleted successfully");
        } catch (Exception e) {
            return new Status(false, "Failed to delete weekly schedule");
        }
    }

    @Override
    public WeeklyScheduleDTO getById(Long id) {
        return weeklyScheduleRepo.findById(id)
            .map(WeeklyScheduleDTO::new)
            .orElseThrow(() -> new EntityNotFoundException("Weekly schedule with id '" + id + "' not found"));
    }

    @Override
    public List<WeeklyScheduleDTO> findAll() {
        return weeklyScheduleRepo.findAll().stream()
            .map(WeeklyScheduleDTO::new)
            .toList();
    }

    @Override
    public List<WeeklyScheduleDTO> findAllByBranchId(Long branchId) {
        return weeklyScheduleRepo.findAllByDoctorBranch_branch_id(branchId).stream()
            .map(WeeklyScheduleDTO::new)
            .toList();
    }

    @Override
    public List<WeeklyScheduleDTO> findAllByDoctorId(Long doctorId) {
        return weeklyScheduleRepo.findAllByDoctorBranch_doctor_idAndActive(doctorId, true).stream()
            .map(WeeklyScheduleDTO::new)
            .toList();
    }

    @Override
    public List<WeeklyScheduleDTO> findAllByBranchAndDoctorId(Long branchId, Long doctorId) {
        return weeklyScheduleRepo.findAllByDoctorBranch_branch_idAndDoctorBranch_doctor_idOrderByIdAsc(branchId, doctorId).stream()
            .map(WeeklyScheduleDTO::new)
            .toList();
    }

    @Override
    public List<WeeklySchedule> findAllByActive(boolean active) {
        return weeklyScheduleRepo.findAllByActive(active);
    }

    @Override
    public List<WeeklyScheduleWithoutDrBranch> findAllByDoctorBranchId(Long drBranchId) {
        return weeklyScheduleRepo.findAllByDoctorBranch_idOrderByIdAsc(drBranchId).stream()
            .map(WeeklyScheduleWithoutDrBranch::new)
            .toList();
    }

    @Override
    @Transactional
    public Status generatePreviewSlots(Long doctorBranchId) {
        try {
            log.info("Starting preview slot generation for doctor branch: {}", doctorBranchId);
            
            // Clean up existing preview slots for this doctor branch
            cleanupPreviewSlots(doctorBranchId);
            
            // Get active schedules for this doctor branch
            List<WeeklySchedule> schedules = weeklyScheduleRepo.findAllByDoctorBranch_idAndActive(doctorBranchId, true);
            
            if (schedules.isEmpty()) {
                return new Status(false, "No active weekly schedule found");
            }
            
            LocalDate startDate = LocalDate.now();
            LocalDate endDate = startDate.plusDays(30); // Generate for next 30 days
            
            List<Slot> previewSlots = new ArrayList<>();
            
            for (WeeklySchedule schedule : schedules) {
                generateSlotsForSchedule(schedule, startDate, endDate, previewSlots);
            }
            
            if (!previewSlots.isEmpty()) {
                slotRepo.saveAll(previewSlots);
                log.info("Generated {} preview slots for doctor branch: {}", previewSlots.size(), doctorBranchId);
            }
            
            return new Status(true, "Preview slots generated successfully");
            
        } catch (Exception e) {
            log.error("Error generating preview slots for doctor branch {}: {}", doctorBranchId, e.getMessage(), e);
            return new Status(false, "Failed to generate preview slots: " + e.getMessage());
        }
    }

    private void cleanupPreviewSlots(Long doctorBranchId) {
        try {
            LocalDate today = LocalDate.now();
            Date startDate = Date.from(today.atStartOfDay(ZoneId.systemDefault()).toInstant());
            Date endDate = Date.from(today.plusDays(30).atStartOfDay(ZoneId.systemDefault()).toInstant());
            
            // Delete existing PENDING slots in the date range
            slotRepo.deletePendingSlotsByDoctorBranchAndDateRange(doctorBranchId, startDate, endDate);
            
        } catch (Exception e) {
            log.warn("Error cleaning up preview slots: {}", e.getMessage());
        }
    }

    private void generateSlotsForSchedule(WeeklySchedule schedule, LocalDate startDate, LocalDate endDate, List<Slot> previewSlots) {
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            if (isScheduleActiveForDate(schedule, date)) {
                generateSlotsForDate(schedule, date, previewSlots);
            }
        }
    }

    private boolean isScheduleActiveForDate(WeeklySchedule schedule, LocalDate date) {
        return schedule.getDayOfWeek().name().equalsIgnoreCase(date.getDayOfWeek().name());
    }

    private void generateSlotsForDate(WeeklySchedule schedule, LocalDate date, List<Slot> previewSlots) {
        if (schedule.getTimeRanges() == null || schedule.getTimeRanges().isEmpty()) {
            return;
        }
        
        Date slotDate = Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant());
        
        for (DoctorTimeRange timeRange : schedule.getTimeRanges()) {
            LocalTime startTime = timeRange.getStartTime();
            LocalTime endTime = timeRange.getEndTime();
            int slotDuration = timeRange.getSlotDuration();
            
            while (!startTime.plusMinutes(slotDuration).isAfter(endTime)) {
                // Check if slot already exists
                boolean exists = slotRepo.existsByDoctorBranch_idAndDateAndStartTimeAndEndTime(
                    schedule.getDoctorBranch().getId(),
                    slotDate,
                    startTime,
                    startTime.plusMinutes(slotDuration)
                );
                
                if (!exists) {
                    Slot slot = createPreviewSlot(schedule, slotDate, startTime, startTime.plusMinutes(slotDuration), slotDuration);
                    previewSlots.add(slot);
                }
                
                startTime = startTime.plusMinutes(slotDuration);
            }
        }
    }

    private Slot createPreviewSlot(WeeklySchedule schedule, Date date, LocalTime startTime, LocalTime endTime, int duration) {
        Slot slot = new Slot();
        slot.setDoctorBranch(schedule.getDoctorBranch());
        slot.setDate(date);
        slot.setStartTime(startTime);
        slot.setEndTime(endTime);
        slot.setDuration(duration);
        slot.setStatus(SlotStatus.PENDING); // Preview slots are PENDING by default
        slot.setSlotType(SlotType.TIMEWISE);
        slot.setAvailableSlots(1);
        slot.setTotalSlots(1);
        return slot;
    }

    @Override
    public List<Slot> getSlotsByDoctorBranchId(Long doctorBranchId, String date) {
        return slotService.getSlotsByDoctorBranchIdAndDate(doctorBranchId, date);
    }
}
