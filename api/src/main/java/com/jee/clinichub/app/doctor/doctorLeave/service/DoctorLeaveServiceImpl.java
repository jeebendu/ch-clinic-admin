package com.jee.clinichub.app.doctor.doctorLeave.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.doctor.doctorLeave.model.DoctorLeave;
import com.jee.clinichub.app.doctor.doctorLeave.model.DoctorLeaveDTO;
import com.jee.clinichub.app.doctor.doctorLeave.repository.DoctorLeaveRepo;
import com.jee.clinichub.app.doctor.model.Doctor;
import com.jee.clinichub.app.doctor.model.DoctorBranch;
import com.jee.clinichub.app.doctor.repository.DoctorBranchRepo;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DoctorLeaveServiceImpl implements DoctorLeaveService {

    private final DoctorLeaveRepo dLeaveRepo;
    private final DoctorBranchRepo doctorBranchRepo;

    @Override
    public Status saveOrUpdate(DoctorLeaveDTO doctorLeaveDTO) {
        try {

            DoctorBranch doctorBranch = doctorBranchRepo.findById(doctorLeaveDTO.getDoctorBranch().getId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Doctor branch not found with ID: " + doctorLeaveDTO.getDoctorBranch().getId()));

            DoctorLeave doctorLeave = doctorLeaveDTO.getId() == null
                    ? new DoctorLeave(doctorLeaveDTO)

                    : updateEntity(dLeaveRepo.findById(doctorLeaveDTO.getId())
                            .orElseThrow(() -> new EntityNotFoundException("Schedule break not found")),
                            doctorLeaveDTO);
            doctorLeave.setDoctorBranch(doctorBranch);

            dLeaveRepo.save(doctorLeave);

            return new Status(true, doctorLeaveDTO.getId() != null ? "Save Successfuly" : "update Successfuly");
        } catch (Exception e) {
            return new Status(false, "Error saving/updating schedule break: " + e.getMessage());
        }
    }

    private DoctorLeave updateEntity(DoctorLeave entity, DoctorLeaveDTO dto) {
        entity.setApproved(dto.isApproved());
        entity.setLeaveStart(dto.getLeaveStart());
        entity.setLeaveEnd(dto.getLeaveEnd());
        entity.setReason(dto.getReason());
        return entity;
    }

    @Override
    public Status deleteById(Long id) {
        if (dLeaveRepo.existsById(id)) {
            dLeaveRepo.deleteById(id);
            return new Status(true, "Deleted Successfully");
        } else {
            return new Status(false, "doctor leave not found with ID: " + id);
        }
    }

    @Override
    public DoctorLeaveDTO getById(Long id) {
        return dLeaveRepo.findById(id)
                .map(DoctorLeaveDTO::new)
                .orElseThrow(() -> new EntityNotFoundException("doctor leave not found with ID: " + id));
    }

    @Override
    public List<DoctorLeaveDTO> findAll() {
        return dLeaveRepo.findAll().stream()
                .map(DoctorLeaveDTO::new)
                .toList();
    }

    @Override
    public List<DoctorLeaveDTO> findAllByBranchId(Long branchId) {
        return dLeaveRepo.findAllByDoctorBranch_branch_id(branchId).stream()
                .map(DoctorLeaveDTO::new)
                .toList();
    }

    @Override
    public List<DoctorLeaveDTO> findAllByBranchAndDoctorId(Long branchId, Long doctorId) {
        return dLeaveRepo.findAllByDoctorBranch_branch_idAndDoctorBranch_doctor_idOrderByIdAsc(branchId, doctorId)
                .stream()
                .map(DoctorLeaveDTO::new)
                .toList();
    }

    @Override
    public List<DoctorLeaveDTO> findAllByBranchDoctorId(Long drBranchId) {
        return dLeaveRepo.findAllByDoctorBranch_id(drBranchId).stream()
                .map(DoctorLeaveDTO::new)
                .toList();
    }

}
