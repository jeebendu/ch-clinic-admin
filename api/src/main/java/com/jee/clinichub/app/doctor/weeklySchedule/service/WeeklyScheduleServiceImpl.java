package com.jee.clinichub.app.doctor.weeklySchedule.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.jee.clinichub.app.doctor.model.DoctorBranch;
import com.jee.clinichub.app.doctor.model.DoctorBranchDto;
import com.jee.clinichub.app.doctor.repository.DoctorBranchRepo;
import com.jee.clinichub.app.doctor.slots.model.Slot;
import com.jee.clinichub.app.doctor.slots.service.SlotService;
import com.jee.clinichub.app.doctor.timeRange.repository.DoctorTimeRangeRepository;
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
            slotService.generatePreviewSlots(drBranchId,7);

            return new Status(true, "Weekly schedules saved successfully");
        } catch (Exception e) {
            log.error("Error saving weekly schedules: {}", e.getMessage(), e);
            return new Status(false, "Failed to save weekly schedules: " + e.getMessage());
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

	@Override
	public Status generatePreviewSlots(Long doctorBranchId) {
		return slotService.generatePreviewSlots(doctorBranchId,7);
	}

	@Override
	public List<Slot> getSlotsByDoctorBranchId(Long doctorBranchId, String date) {
		
		return slotService.getSlotsByDoctorBranchId(doctorBranchId,date);
	}
	
	@Override
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void generateSlotsForTenant(String clientId) {
	    long startTime = System.currentTimeMillis();
	    log.info("🟢 [Client: {}] Starting slot generation for tenant...", clientId);

	    List<WeeklySchedule> activeSchedules = findAllByActive(true);
	    if (activeSchedules.isEmpty()) {
	        log.warn("⚠️ [Client: {}] No active schedules found. Skipping slot generation.", clientId);
	        return;
	    }

	    int totalBranches = activeSchedules.size();
	    int successCount = 0;
	    int failCount = 0;

	    for (WeeklySchedule schedule : activeSchedules) {
	        Long branchId = schedule.getDoctorBranch().getId();
	        try {
	            log.info("📅 [Client: {}] Generating slots for Branch ID: {} (Next 7 days)", clientId, branchId);
	            slotService.generatePreviewSlots(branchId, 7); // keeps next 7 days full
	            successCount++;
	        } catch (Exception e) {
	            failCount++;
	            log.error("❌ [Client: {}] Failed to generate slots for Branch ID: {} - {}",
	                      clientId, branchId, e.getMessage(), e);
	        }
	    }

	    long duration = System.currentTimeMillis() - startTime;
	    log.info("✅ [Client: {}] Slot generation completed. Branches: {} | Success: {} | Failed: {} | Time: {} ms",
	             clientId, totalBranches, successCount, failCount, duration);
	}

	
}
