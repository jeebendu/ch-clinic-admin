package com.jee.clinichub.app.doctor.slots.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.jee.clinichub.app.doctor.model.DoctorBranch;
import com.jee.clinichub.app.doctor.service.DoctorService;
import com.jee.clinichub.app.doctor.slots.model.Slot;
import com.jee.clinichub.app.doctor.slots.model.SlotDto;
import com.jee.clinichub.app.doctor.slots.repository.SlotRepo;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class DoctorSlotSyncService {

    private final DoctorService doctorService;
    private final SlotRepo slotRepo;
    private final SlotService slotService;

    @Value("${app.default-tenant}")
    private String defaultTenant;

    @PersistenceContext
    private EntityManager entityManager;

    public void syncSlotToMaster(UUID doctorBranchGlobalId,LocalDate date) {
        try {

          ZoneId zone = ZoneId.systemDefault();

        Date startOfDay = Date.from(date.atStartOfDay(zone).toInstant());
        Date endOfDay = Date.from(date.atTime(LocalTime.MAX).atZone(zone).toInstant());

        List<Slot> existingSlots = slotRepo
            .findAllByDoctorBranch_globalDoctorBranchIdAndDateBetween(
                doctorBranchGlobalId, startOfDay, endOfDay);

            this.saveSlotToTenant(doctorBranchGlobalId, existingSlots);

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to sync doctor to master schema for GlobalDoctorId: " + doctorBranchGlobalId, e);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void saveSlotToTenant(UUID doctorBranchGlobalId, List<Slot> existingSlots) {
        String originalTenantContext = TenantContextHolder.getCurrentTenant();
        try {
            TenantContextHolder.setCurrentTenant(defaultTenant);

            if (existingSlots == null || existingSlots.isEmpty()) {
                log.info("No slots provided to sync for GlobalDoctorBranchId: {}", doctorBranchGlobalId);
                return;
            }

            Optional<DoctorBranch> doctorBranch = doctorService.findDoctorBranchByGlobalId(doctorBranchGlobalId);
            if (doctorBranch.isEmpty()) {
                throw new EntityNotFoundException("Doctor Branch not found with global id: " + doctorBranchGlobalId);
            }

            List<UUID> globalSlotIds = existingSlots.stream()
                    .map(Slot::getGlobalSlotId)
                    .collect(Collectors.toList());

            List<UUID> existingGlobalSlotIds = slotService.slotByGlobalIdIn(globalSlotIds);

            List<Slot> slotList = existingSlots.stream()
                    .filter(slot -> !existingGlobalSlotIds.contains(slot.getGlobalSlotId()))
                    .map(dto -> {
                        Slot slot = new Slot(new SlotDto(dto));
                        slot.setDoctorBranch(doctorBranch.get());
                        slot.setId(null); // Save as new record
                        return slot;
                    })
                    .collect(Collectors.toList());

            if (!slotList.isEmpty()) {
                Status status = slotService.saveAllSlot(slotList);
                if (!status.isStatus()) {
                    throw new RuntimeException("Fail to save to master");
                }
                log.info("Successfully synced {} slot(s) to master schema for GlobalDoctorBranchId: {}",
                        slotList.size(), doctorBranchGlobalId);
            } else {
                log.info("No new slots to sync for GlobalDoctorBranchId: {}", doctorBranchGlobalId);
            }

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to sync slots to master schema for GlobalDoctorBranchId: " + doctorBranchGlobalId, e);
        } finally {
            TenantContextHolder.setCurrentTenant(originalTenantContext);
        }
    }

   


}
