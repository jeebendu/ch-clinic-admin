package com.jee.clinichub.app.patient.schedule.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.branch.context.BranchContextHolder;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.patient.schedule.model.DoctorReferralDto;
import com.jee.clinichub.app.patient.schedule.model.DrReferalSearch;
import com.jee.clinichub.app.patient.schedule.model.Schedule;
import com.jee.clinichub.app.patient.schedule.model.ScheduleCountDTO;
import com.jee.clinichub.app.patient.schedule.model.ScheduleDto;
import com.jee.clinichub.app.patient.schedule.model.SearchSchedule;
import com.jee.clinichub.app.patient.schedule.repository.ScheduleRepository;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ScheduleServiceImpl implements ScheduleService {

    private static final Logger log = LoggerFactory.getLogger(ScheduleServiceImpl.class);

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Override
    public ScheduleDto getById(Long id) {
        ScheduleDto scheduleDto = new ScheduleDto();
        try {
            Optional<Schedule> schedule = scheduleRepository.findById(id);
            if (schedule.isPresent()) {
                scheduleDto = new ScheduleDto(schedule.get());
            }
        } catch (Exception e) {
            log.error(e.getLocalizedMessage());
        }
        return scheduleDto;
    }

    @Override
    public Status deleteById(Long id) {
        try {
            Optional<Schedule> schedule = scheduleRepository.findById(id);
            if (!schedule.isPresent()) {
                return new Status(false, "Schedule Not Found");
            }
            scheduleRepository.deleteById(id);
            return new Status(true, "Deleted Successfully");
        } catch (Exception e) {
            log.error(e.getLocalizedMessage());
        }
        return new Status(false, "Something went wrong");
    }

    @Override
    public Status saveOrUpdate(ScheduleDto scheduleDto) {
        try {
            Schedule schedule = new Schedule();
            if (scheduleDto.getId() == null) {
                schedule = new Schedule(scheduleDto);
            } else {
                schedule = this.setSchedule(scheduleDto);
            }
            schedule = scheduleRepository.save(schedule);
            return new Status(true, ((scheduleDto.getId() == null) ? "Added" : "Updated") + " Successfully");
        } catch (Exception e) {
            log.error(e.getLocalizedMessage());
        }
        return new Status(false, "Something went wrong");
    }

    private Schedule setSchedule(ScheduleDto scheduleDto) {
        Schedule exSchedule = scheduleRepository.findById(scheduleDto.getId()).get();
        // Update schedule fields as needed
        return exSchedule;
    }

    @Override
    public List<ScheduleDto> getAllSchedules() {
        List<Schedule> scheduleList = scheduleRepository.findAll();
        List<ScheduleDto> scheduleDtoList = scheduleList.stream().map(ScheduleDto::new).collect(Collectors.toList());
        return scheduleDtoList;
    }

    @Override
    public Page<ScheduleDto> getAllSchedulesPaginated(Pageable pageable, Long branchId, SearchSchedule search) {
        try {
            // Get current branch if branchId is not provided
            Long currentBranchId = branchId;
            if (currentBranchId == null) {
                Branch currentBranch = BranchContextHolder.getCurrentBranch();
                if (currentBranch != null) {
                    currentBranchId = currentBranch.getId();
                } else {
                    throw new RuntimeException("No branch context found");
                }
            }

            // Extract search parameters
            Long doctorId = (search != null) ? search.getDoctorId() : null;
            String patientName = (search != null) ? search.getPatientName() : null;

            // Use repository method with filters
            Page<Schedule> schedulePage = scheduleRepository.findSchedulesByBranchWithFilters(
                currentBranchId, doctorId, patientName, pageable);

            // Convert to DTO page
            return schedulePage.map(ScheduleDto::new);

        } catch (Exception e) {
            log.error("Error fetching paginated schedules: {}", e.getLocalizedMessage());
            throw new RuntimeException("Failed to fetch paginated schedules", e);
        }
    }

    @Override
    public Schedule getScheduleById(Long id) {
        return scheduleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Schedule not found with ID: " + id));
    }

    @Override
    public List<ScheduleDto> getAllSchedulesByPID(Long pid) {
        List<Schedule> scheduleList = scheduleRepository.findAllByPatient_id(pid);
        List<ScheduleDto> scheduleDtoList = scheduleList.stream().map(ScheduleDto::new).collect(Collectors.toList());
        return scheduleDtoList;
    }

    @Override
    public List<Schedule> getAllScheduleByRefDtos(SearchSchedule search) {
        try {
            if (search.getDoctorId() != null && search.getBranchId() != null) {
                if (search.getFromDate() != null && search.getToDate() != null) {
                    return scheduleRepository.findAllByReferByDoctor_idAndPatient_branch_idAndCreatedTimeBetween(
                            search.getDoctorId(), search.getBranchId(), search.getFromDate(), search.getToDate());
                } else {
                    return scheduleRepository.findAllByReferByDoctor_idAndPatient_branch_id(
                            search.getDoctorId(), search.getBranchId());
                }
            }
            return scheduleRepository.findAll();
        } catch (Exception e) {
            log.error("Error fetching schedules by ref: {}", e.getLocalizedMessage());
            return scheduleRepository.findAll();
        }
    }

    @Override
    public List<DoctorReferralDto> countUniqueScheduleByDateAndRefDotor(DrReferalSearch search) {
        try {
            List<ScheduleCountDTO> countList = scheduleRepository.countSchedulesByReferByDoctorAndUniqueDate(
                    search.getBranchId(), search.getMonth(), search.getYear());
            
            return countList.stream().map(count -> {
                DoctorReferralDto dto = new DoctorReferralDto();
                dto.setDoctor(count.getDoctor());
                dto.setCount(count.getCount());
                dto.setDate(count.getDate());
                return dto;
            }).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error counting schedules by doctor referral: {}", e.getLocalizedMessage());
            return List.of();
        }
    }
}
