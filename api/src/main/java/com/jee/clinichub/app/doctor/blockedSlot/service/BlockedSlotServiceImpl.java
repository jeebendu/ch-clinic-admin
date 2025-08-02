package com.jee.clinichub.app.doctor.blockedSlot.service;

import java.util.List;

import org.springframework.stereotype.Service;
import com.jee.clinichub.app.doctor.blockedSlot.model.BlockedSlot;
import com.jee.clinichub.app.doctor.blockedSlot.model.BlockedSlotDTO;
import com.jee.clinichub.app.doctor.blockedSlot.repository.BlockedSlotRepo;
import com.jee.clinichub.app.doctor.model.Doctor;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BlockedSlotServiceImpl implements BlockedSlotService {

    private final BlockedSlotRepo bSlotRepo;

    @Override
    public Status saveOrUpdate(BlockedSlotDTO blockedSlotDTO) {
        try {

            BlockedSlot blockedSlot = blockedSlotDTO.getId() == null
                    ? new BlockedSlot(blockedSlotDTO)

                    : updateEntity(bSlotRepo.findById(blockedSlotDTO.getId())
                            .orElseThrow(() -> new EntityNotFoundException("Blocked slot not found")),
                            blockedSlotDTO);

            bSlotRepo.save(blockedSlot);

            return new Status(true, blockedSlotDTO.getId() != null ? "Save Successfuly" : "update Successfuly");
        } catch (Exception e) {
            return new Status(false, "Error saving/updating schedule break: " + e.getMessage());
        }
    }

    private BlockedSlot updateEntity(BlockedSlot entity, BlockedSlotDTO dto) {
        entity.setDoctor(new Doctor(dto.getDoctor()));
        entity.setSlotDate(dto.getSlotDate());
        entity.setStartTime(dto.getStartTime());
        entity.setEndTime(dto.getEndTime());
        entity.setReason(dto.getReason());
        return entity;
    }

    @Override
    public Status deleteById(Long id) {
        if (bSlotRepo.existsById(id)) {
            bSlotRepo.deleteById(id);
            return new Status(true, "Deleted Successfully");
        } else {
            return new Status(false, "Blocked slot not found with ID: " + id);
        }
    }

    @Override
    public BlockedSlotDTO getById(Long id) {
        return bSlotRepo.findById(id)
                .map(BlockedSlotDTO::new)
                .orElseThrow(() -> new EntityNotFoundException("Blocked slot not found with ID: " + id));
    }

    @Override
    public List<BlockedSlotDTO> findAll() {
        return bSlotRepo.findAll().stream()
                .map(BlockedSlotDTO::new)
                .toList();
    }

    @Override
    public List<BlockedSlotDTO> findAllByDoctorId(Long doctorId) {
        return bSlotRepo.findAllByDoctor_idOrderByIdAsc(doctorId).stream()
                .map(BlockedSlotDTO::new)
                .toList();
    }

}
