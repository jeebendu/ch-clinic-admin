package com.jee.clinichub.app.doctor.weeklySchedule.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.doctor.model.DoctorBranch;
import com.jee.clinichub.app.doctor.slots.model.Slot;
import com.jee.clinichub.app.doctor.slots.model.SlotDto;
import com.jee.clinichub.app.doctor.slots.model.SlotFilter;
import com.jee.clinichub.app.doctor.slots.model.SlotHandler;
import com.jee.clinichub.app.doctor.slots.model.SlotStatus;
import com.jee.clinichub.app.doctor.slots.model.SlotType;
import com.jee.clinichub.app.doctor.slots.service.SlotService;
import com.jee.clinichub.app.doctor.weeklySchedule.model.WeeklySchedule;
import com.jee.clinichub.app.doctor.weeklySchedule.model.WeeklyScheduleDTO;
import com.jee.clinichub.app.doctor.weeklySchedule.model.WeeklyScheduleWithoutDrBranch;
import com.jee.clinichub.app.doctor.weeklySchedule.repository.WeeklyScheduleRepo;
import com.jee.clinichub.global.model.Status;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class WeeklyScheduleServiceImpl implements WeeklyScheduleService {

	@Autowired
	private WeeklyScheduleRepo weeklyScheduleRepo;

	@Autowired
	private SlotService slotService;

    @Override
    public Status saveOrUpdate(List<WeeklyScheduleDTO> scheduleDtoList,Long drBranchId) {
        try {
            scheduleDtoList.forEach(item->{
                WeeklySchedule weeklySchedule = new WeeklySchedule();
                if(item.getId()==null){
                    weeklySchedule = new WeeklySchedule(item);
                }else{
                    weeklySchedule = this.setWeeklySchedule(item);
                }
                weeklyScheduleRepo.save(weeklySchedule);
            });
            return new Status(true,"Saved Successfully");
        } catch (Exception e) {
            log.error(e.getLocalizedMessage());
        }
        return new Status(false,"Something went wrong");
    }

    private WeeklySchedule setWeeklySchedule(WeeklyScheduleDTO item) {
        WeeklySchedule weeklySchedule = weeklyScheduleRepo.findById(item.getId()).get();
        weeklySchedule.setDayOfWeek(item.getDayOfWeek());
        weeklySchedule.setStartTime(item.getStartTime());
        weeklySchedule.setEndTime(item.getEndTime());
        return weeklySchedule;
    }

    @Override
    public Status deleteById(Long id) {
        weeklyScheduleRepo.findById(id).ifPresentOrElse(weeklyScheduleRepo::delete, () -> {
            throw new RuntimeException("Weekly Schedule not found");
        });
        return new Status(true, "Weekly Schedule Deleted Successfully");
    }

    @Override
    public WeeklyScheduleDTO getById(Long id) {
        return weeklyScheduleRepo.findById(id).map(WeeklyScheduleDTO::new).orElseThrow(() -> {
            throw new RuntimeException("Weekly Schedule not found");
        });
    }

    @Override
    public List<WeeklyScheduleDTO> findAll() {
        return weeklyScheduleRepo.findAll().stream().map(WeeklyScheduleDTO::new).toList();
    }

    @Override
    public List<WeeklyScheduleDTO> findAllByBranchId(Long branchId) {
        return weeklyScheduleRepo.findAllByDoctorBranch_branch_id(branchId).stream().map(WeeklyScheduleDTO::new).toList();
    }

    @Override
    public List<WeeklyScheduleDTO> findAllByDoctorId(Long doctorId) {
        return weeklyScheduleRepo.findAllByDoctorBranch_doctor_id(doctorId).stream().map(WeeklyScheduleDTO::new).toList();
    }

    @Override
    public List<WeeklyScheduleDTO> findAllByBranchAndDoctorId(Long branchId, Long doctorId) {
        return weeklyScheduleRepo.findAllByDoctorBranch_branch_idAndDoctorBranch_doctor_id(branchId, doctorId).stream().map(WeeklyScheduleDTO::new).toList();
    }
    
    @Override
    public List<WeeklySchedule> findAllByActive(boolean b) {
        return weeklyScheduleRepo.findAll();
    }

    @Override
    public List<WeeklyScheduleWithoutDrBranch> findAllByDoctorBranchId(Long drBranchId) {
        return weeklyScheduleRepo.findAllByDoctorBranch_id(drBranchId).stream().map(WeeklyScheduleWithoutDrBranch::new).toList();
    }

    @Override
    public Status generatePreviewSlots(Long doctorBranchId) {
        List<WeeklyScheduleWithoutDrBranch> weeklySchedules = weeklyScheduleRepo.findAllByDoctorBranch_id(doctorBranchId).stream().map(WeeklyScheduleWithoutDrBranch::new).toList();
        LocalDate today = LocalDate.now();
        LocalDate futureDate = today.plusDays(7);

        for (LocalDate date = today; !date.isAfter(futureDate); date = date.plusDays(1)) {
            DayOfWeek dayOfWeek = date.getDayOfWeek();
            for (WeeklyScheduleWithoutDrBranch schedule : weeklySchedules) {
                if (schedule.getDayOfWeek().equals(dayOfWeek.toString())) {
                    LocalTime startTime = schedule.getStartTime();
                    LocalTime endTime = schedule.getEndTime();

                    SlotHandler slotHandler = new SlotHandler();
                    slotHandler.setDoctorBranchDto(new com.jee.clinichub.app.doctor.model.DoctorBranchDto());
                    slotHandler.getDoctorBranchDto().setId(doctorBranchId);
                    slotHandler.setDate(Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant()));
                    slotHandler.setStartTime(startTime);
                    slotHandler.setEndTime(endTime);
                    slotHandler.setSlotType(SlotType.TIMEWISE);
                    slotHandler.setSlotDuration(30);
                    slotHandler.setMaxCapacity(1);
                    slotService.generateSlot(slotHandler);
                }
            }
        }
        return new Status(true, "Slots generated successfully");
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
}
