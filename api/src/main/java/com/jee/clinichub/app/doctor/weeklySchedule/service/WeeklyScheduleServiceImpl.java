package com.jee.clinichub.app.doctor.weeklySchedule.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jee.clinichub.app.doctor.model.DoctorBranch;
import com.jee.clinichub.app.doctor.repository.DoctorBranchRepo;
import com.jee.clinichub.app.doctor.slots.model.Slot;
import com.jee.clinichub.app.doctor.slots.model.SlotHandler;
import com.jee.clinichub.app.doctor.slots.model.SlotStatus;
import com.jee.clinichub.app.doctor.slots.model.SlotType;
import com.jee.clinichub.app.doctor.slots.service.SlotService;
import com.jee.clinichub.app.doctor.weeklySchedule.model.DayOfWeek;
import com.jee.clinichub.app.doctor.weeklySchedule.model.WeeklySchedule;
import com.jee.clinichub.app.doctor.weeklySchedule.model.WeeklyScheduleDTO;
import com.jee.clinichub.app.doctor.weeklySchedule.model.WeeklyScheduleWithoutDrBranch;
import com.jee.clinichub.app.doctor.weeklySchedule.repository.WeeklyScheduleRepo;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class WeeklyScheduleServiceImpl implements WeeklyScheduleService {

    private final WeeklyScheduleRepo weeklyScheduleRepo;
    private final DoctorBranchRepo doctorBranchRepo;
    private final SlotService slotService;

    @Override
    public Status saveOrUpdate(List<WeeklyScheduleDTO> scheduleDtoList,Long drBranchId) {
        try {
            Optional<DoctorBranch> doctorBranch = doctorBranchRepo.findById(drBranchId);
            if(doctorBranch.isEmpty()){
                throw new EntityNotFoundException("Doctor Branch not found");
            }
            scheduleDtoList.forEach(scheduleDto -> {
                WeeklySchedule schedule = scheduleDto.getId() == null ? new WeeklySchedule(scheduleDto)
                        : setScheduleInfo(scheduleDto);
                schedule.setDoctorBranch(doctorBranch.get());
                weeklyScheduleRepo.save(schedule);
            });
            return new Status(true, "Saved Successfully");
        } catch (Exception e) {
            log.error("Error saving or updating weekly schedule: {}", e.getMessage(), e);
            return new Status(false, "Something went wrong");
        }
    }

    public WeeklySchedule setScheduleInfo(WeeklyScheduleDTO scheduleDto) {
        WeeklySchedule schedule = weeklyScheduleRepo.findById(scheduleDto.getId()).orElseThrow(() -> {
            throw new EntityNotFoundException("Weekly Schedule not found");
        });
        schedule.setDayOfWeek(scheduleDto.getDayOfWeek());
        schedule.setStartTime(scheduleDto.getStartTime());
        schedule.setEndTime(scheduleDto.getEndTime());
        return schedule;
    }

    @Override
    public Status deleteById(Long id) {
        weeklyScheduleRepo.findById(id).ifPresentOrElse(weeklyScheduleRepo::delete, () -> {
            throw new EntityNotFoundException("Weekly Schedule not found");
        });
        return new Status(true, "Deleted Successfully");
    }

    @Override
    public WeeklyScheduleDTO getById(Long id) {
        return weeklyScheduleRepo.findById(id).map(WeeklyScheduleDTO::new).orElseThrow(() -> {
            throw new EntityNotFoundException("Weekly Schedule not found");
        });
    }

    @Override
    public List<WeeklyScheduleDTO> findAll() {
        return weeklyScheduleRepo.findAll().stream().map(WeeklyScheduleDTO::new).toList();
    }

    @Override
    public List<WeeklyScheduleDTO> findAllByBranchId(Long branchId) {
        return weeklyScheduleRepo.findAllByDoctorBranch_Branch_id(branchId).stream().map(WeeklyScheduleDTO::new).toList();
    }

    @Override
    public List<WeeklyScheduleDTO> findAllByDoctorId(Long doctorId) {
        return weeklyScheduleRepo.findAllByDoctorBranch_Doctor_id(doctorId).stream().map(WeeklyScheduleDTO::new).toList();
    }

    @Override
    public List<WeeklyScheduleDTO> findAllByBranchAndDoctorId(Long branchId, Long doctorId) {
        return weeklyScheduleRepo.findAllByDoctorBranch_Branch_idAndDoctorBranch_Doctor_id(branchId, doctorId).stream()
                .map(WeeklyScheduleDTO::new).toList();
    }

    @Override
    public List<WeeklySchedule> findAllByActive(boolean b) {
        return weeklyScheduleRepo.findAllByActive(b);
    }

    @Override
    public List<WeeklyScheduleWithoutDrBranch> findAllByDoctorBranchId(Long drBranchId) {
        return weeklyScheduleRepo.findAllByDoctorBranch_id(drBranchId).stream().map(WeeklyScheduleWithoutDrBranch::new).toList();
    }

    @Override
    @Transactional
    public Status generatePreviewSlots(Long doctorBranchId) {
        try {
            DoctorBranch doctorBranch = doctorBranchRepo.findById(doctorBranchId)
                    .orElseThrow(() -> new EntityNotFoundException("Doctor Branch not found"));

            List<WeeklySchedule> weeklySchedules = weeklyScheduleRepo.findAllByDoctorBranch_id(doctorBranchId);

            if (weeklySchedules.isEmpty()) {
                return new Status(false, "No weekly schedule found for this doctor branch.");
            }

            LocalDate today = LocalDate.now();
            LocalDate endDate = today.plusDays(7); // Generate slots for the next 7 days

            List<Slot> slotsToSave = new ArrayList<>();

            for (LocalDate date = today; !date.isAfter(endDate); date = date.plusDays(1)) {
                DayOfWeek dayOfWeek = DayOfWeek.valueOf(date.getDayOfWeek().toString());

                for (WeeklySchedule schedule : weeklySchedules) {
                    if (schedule.getDayOfWeek() == dayOfWeek) {
                        LocalTime startTime = schedule.getStartTime();
                        LocalTime endTime = schedule.getEndTime();

                        if (endTime.isBefore(startTime) || endTime.equals(startTime)) {
                            log.warn("End time is before or equals start time for schedule ID: {}", schedule.getId());
                            continue; // Skip if end time is invalid
                        }

                        LocalDateTime startDateTime = date.atTime(startTime);
                        LocalDateTime endDateTime = date.atTime(endTime);

                        Date startDate = Date.from(startDateTime.atZone(ZoneId.systemDefault()).toInstant());
                        Date endDateValue = Date.from(endDateTime.atZone(ZoneId.systemDefault()).toInstant());

                        if (slotService.getFilteredSlots(new SlotHandler(new com.jee.clinichub.app.doctor.model.DoctorBranchDto(doctorBranch),Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant()))).isEmpty() &&
                                !slotService.slotByGlobalIdIn(new ArrayList<>()).isEmpty() &&
                                !slotService.slotByGlobalIdIn(new ArrayList<>()).equals(null)
                        ) {
                            if (!slotService.slotByGlobalIdIn(new ArrayList<>()).isEmpty()) {
                                log.warn("Slot already exists for doctor branch ID: {} on date: {} between {} and {}",
                                        doctorBranchId, date, startTime, endTime);
                            }
                            continue; // Skip if slot already exists
                        }

                        Slot slot = new Slot();
                        slot.setDoctorBranch(doctorBranch);
                        slot.setDate(startDate);
                        slot.setStartTime(startTime);
                        slot.setEndTime(endTime);
                        slot.setSlotType(SlotType.TIMEWISE);
                        slot.setAvailableSlots(1);
                        slot.setTotalSlots(1);
                        slot.setStatus(SlotStatus.AVAILABLE);
                        slot.setDuration((int) java.time.Duration.between(startTime, endTime).toMinutes());

                        slotsToSave.add(slot);
                    }
                }
            }

            if (!slotsToSave.isEmpty()) {
                slotService.saveAllSlot(slotsToSave);
                return new Status(true, "Preview slots generated successfully.");
            } else {
                return new Status(false, "No slots generated. Please check weekly schedule and configurations.");
            }

        } catch (Exception e) {
            log.error("Error generating preview slots for doctor branch ID {}: {}", doctorBranchId, e.getMessage());
            return new Status(false, "Failed to generate preview slots.");
        }
    }

    @Override
    public List<Slot> getSlotsByDoctorBranchId(Long doctorBranchId) {
        try {
            Optional<DoctorBranch> doctorBranch = doctorBranchRepo.findById(doctorBranchId);
            if (doctorBranch.isEmpty()) {
                log.warn("Doctor branch not found with ID: {}", doctorBranchId);
                return new ArrayList<>();
            }

            // Get current date to fetch future slots
            Date currentDate = new Date();
            
            // Create a SlotHandler with current date to fetch existing slots
            SlotHandler slotHandler = new SlotHandler();
            slotHandler.setDoctorBranchDto(new com.jee.clinichub.app.doctor.model.DoctorBranchDto(doctorBranch.get()));
            slotHandler.setDate(currentDate);
            
            // Fetch slots using the existing SlotService method
            return slotService.getFilteredSlots(slotHandler)
                    .stream()
                    .map(slotDto -> {
                        Slot slot = new Slot();
                        slot.setId(slotDto.getId());
                        slot.setDate(slotDto.getDate());
                        slot.setStartTime(slotDto.getStartTime());
                        slot.setEndTime(slotDto.getEndTime());
                        slot.setAvailableSlots(slotDto.getAvailableSlots());
                        slot.setTotalSlots(slotDto.getTotalSlots());
                        slot.setDuration(slotDto.getDuration());
                        slot.setSlotType(slotDto.getSlotType());
                        slot.setStatus(slotDto.getStatus());
                        slot.setDoctorBranch(doctorBranch.get());
                        return slot;
                    })
                    .toList();
            
        } catch (Exception e) {
            log.error("Error fetching slots for doctor branch ID {}: {}", doctorBranchId, e.getMessage());
            return new ArrayList<>();
        }
    }
}
