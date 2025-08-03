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

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.jee.clinichub.app.doctor.model.DoctorBranch;
import com.jee.clinichub.app.doctor.slots.model.Slot;
import com.jee.clinichub.app.doctor.slots.model.SlotDto;
import com.jee.clinichub.app.doctor.slots.model.SlotFilter;
import com.jee.clinichub.app.doctor.slots.model.SlotHandler;
import com.jee.clinichub.app.doctor.slots.model.SlotProj;
import com.jee.clinichub.app.doctor.slots.model.SlotStatus;
import com.jee.clinichub.app.doctor.slots.model.SlotType;
import com.jee.clinichub.app.doctor.slots.repository.SlotRepo;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class SlotServiceImpl implements SlotService {

    private final SlotRepo slotRepo;

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
            // Improved duplicate check using proper slot identification
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
                    
                    // Check if this specific time slot already exists
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
            return new Status(false, "Failed to generate slot");
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
