
package com.jee.clinichub.app.doctor.slots.service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import com.jee.clinichub.app.doctor.slots.model.Slot;
import com.jee.clinichub.app.doctor.slots.model.SlotDto;
import com.jee.clinichub.app.doctor.slots.model.SlotFilter;
import com.jee.clinichub.app.doctor.slots.model.SlotHandler;
import com.jee.clinichub.app.doctor.slots.model.SlotProj;
import com.jee.clinichub.global.model.Status;

public interface SlotService {

    List<SlotDto> getAllSlots();

    List<SlotProj> getFilteredSlots(SlotFilter filter);

    Status generateSlot(SlotHandler slotHandler);

    Status deleteById(Long id);

    List<SlotDto> getFilteredSlots(SlotHandler slotHandler);

    Status saveAllSlot(List<Slot> slotList);

    List<UUID> slotByGlobalIdIn(List<UUID> globalSlotIds);
    
    Slot slotByGlobalId(UUID globalId);

    Status saveOrUpdateSlot(Slot slot);

    List<SlotDto> getSlotsByDoctorBranchIdAndDate(Long doctorBranchId, String date);

    Status cleanupPendingSlots(Long doctorBranchId, Date startDate, Date endDate);
}
