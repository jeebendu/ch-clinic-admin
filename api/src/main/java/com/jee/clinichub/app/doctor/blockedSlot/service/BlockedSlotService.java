package com.jee.clinichub.app.doctor.blockedSlot.service;

import java.util.List;

import com.jee.clinichub.app.doctor.blockedSlot.model.BlockedSlotDTO;
import com.jee.clinichub.global.model.Status;


public interface BlockedSlotService {

    Status saveOrUpdate(BlockedSlotDTO blockedSlotDTO);

    Status deleteById(Long id);

    BlockedSlotDTO getById(Long id);

    List<BlockedSlotDTO> findAll();

    List<BlockedSlotDTO> findAllByDoctorId(Long doctorId);



}
