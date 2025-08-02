package com.jee.clinichub.app.doctor.scheduleBreak.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.doctor.model.Doctor;
import com.jee.clinichub.app.doctor.model.DoctorBranch;
import com.jee.clinichub.app.doctor.model.DoctorBranchDto;
import com.jee.clinichub.app.doctor.repository.DoctorBranchRepo;
import com.jee.clinichub.app.doctor.scheduleBreak.model.ScheduleBreak;
import com.jee.clinichub.app.doctor.scheduleBreak.model.ScheduleBreakDTO;
import com.jee.clinichub.app.doctor.scheduleBreak.repository.ScheduleBreakRepo;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ScheduleBreakServiceImpl implements ScheduleBreakService {

    private final ScheduleBreakRepo scheduleBreakRepo;
    private final DoctorBranchRepo doctorBranchRepo;

    @Transactional
    @Override
    public Status saveOrUpdate(List<ScheduleBreakDTO> scheduleBreakDtoList, Long drBranchId) {
        try {
            DoctorBranch doctorBranch = doctorBranchRepo.findById(drBranchId)
                    .orElseThrow(() -> new EntityNotFoundException("Doctor Branch not found with ID: " + drBranchId));

            for (ScheduleBreakDTO scheduleBreakDto : scheduleBreakDtoList) {
                try {
                    scheduleBreakDto.setDoctorBranch(new DoctorBranchDto(doctorBranch));

                    ScheduleBreak schedule = scheduleBreakDto.getId() == null
                            ? new ScheduleBreak(scheduleBreakDto)
                            : updateEntity(scheduleBreakRepo.findById(scheduleBreakDto.getId())
                                    .orElseThrow(() -> new EntityNotFoundException("Schedule break not found")),
                                    scheduleBreakDto);
                    schedule.setDoctorBranch(doctorBranch);
                    scheduleBreakRepo.save(schedule);
                } catch (Exception e) {
                    return new Status(false, "Error saving/updating schedule break: " + e.getMessage());
                }

            }
            return new Status(true, "Break saving successfuly");
        } catch (Exception e) {
            return new Status(false, "Error saving/updating schedule break: " + e.getMessage());
        }

    }

    private ScheduleBreak updateEntity(ScheduleBreak entity, ScheduleBreakDTO dto) {
        entity.setDayOfWeek(dto.getDayOfWeek());
        entity.setBreakStart(dto.getBreakStart());
        entity.setBreakEnd(dto.getBreakEnd());
        entity.setDescription(dto.getDescription());
        return entity;
    }

    @Override
    public Status deleteById(Long id) {
        try {
            scheduleBreakRepo.findById(id).ifPresentOrElse((sBreak) -> {
                scheduleBreakRepo.deleteById(id);
            }, () -> {
                throw new EntityNotFoundException("Schedule break not found with id:" + id);
            });
            return new Status(true, "Deleted Successfully");
        } catch (Exception e) {
            return new Status(false, "Fail to delete Schedule break");
        }
    }

    @Override
    public ScheduleBreakDTO getById(Long id) {
        return scheduleBreakRepo.findById(id)
                .map(ScheduleBreakDTO::new)
                .orElseThrow(() -> new EntityNotFoundException("Schedule break not found with ID: " + id));
    }

    @Override
    public List<ScheduleBreakDTO> findAll() {
        return scheduleBreakRepo.findAll().stream()
                .map(ScheduleBreakDTO::new)
                .toList();
    }

    @Override
    public List<ScheduleBreakDTO> findAllByBranchId(Long branchId) {
        return scheduleBreakRepo.findAllByDoctorBranch_branch_id(branchId).stream()
                .map(ScheduleBreakDTO::new)
                .toList();
    }

    @Override
    public List<ScheduleBreakDTO> findAllByBranchAndDoctorId(Long branchId, Long doctorId) {
        return scheduleBreakRepo
                .findAllByDoctorBranch_branch_idAndDoctorBranch_doctor_idOrderByIdAsc(branchId, doctorId).stream()
                .map(ScheduleBreakDTO::new)
                .toList();
    }

    @Override
    public List<ScheduleBreakDTO> findByDoctorBranchid(Long drBranchId) {
     return scheduleBreakRepo.findAllByDoctorBranch_id(drBranchId).stream()
                .map(ScheduleBreakDTO::new)
                .toList();
    }
}
