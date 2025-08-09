package com.jee.clinichub.config.schedule;

import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.doctor.slots.service.SlotService;
import com.jee.clinichub.app.doctor.weeklySchedule.service.WeeklyScheduleService;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;
import com.jee.clinichub.global.tenant.model.Tenant;
import com.jee.clinichub.global.tenant.repository.TenantRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class DoctorSlotSchedulerService {

    private final TenantRepository tenantRepository;
    private final SlotService slotService;
    private final WeeklyScheduleService wScheduleService;

    @Scheduled(cron = "0 0 0 * * *") // At 12:00 AM every day
    //@Scheduled(cron = "0 * * * * *") // Every 1 minute at 0th second
    public void generateSlots() {
        String originalTenantContext = TenantContextHolder.getCurrentTenant();
        try {
            List<Tenant> tenantList = tenantRepository.findAll();

            for (Tenant tenantObj : tenantList) {
                try {
                    TenantContextHolder.setCurrentTenant(tenantObj.getClientId());
                    log.info("Generating slots for tenant: {}", tenantObj.getClientId());
                    wScheduleService.generateSlotsForTenant(tenantObj.getClientId());
                } catch (Exception ex) {
                    log.error("❌ Failed to generate slots for tenant: {}", tenantObj.getClientId(), ex);
                }
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to process slot generation for all tenants", e);
        } finally {
            TenantContextHolder.setCurrentTenant(originalTenantContext);
        }
    }

    @Scheduled(cron = "0 0 0 * * *") // At 12:00 AM every day
    //@Scheduled(cron = "0 * * * * *") // Every 1 minute at 0th second
    //@Scheduled(fixedRate = 3 * 60 * 1000)
    public void syncSlotsToMaster() {
        String originalTenantContext = TenantContextHolder.getCurrentTenant();
        try {
            List<Tenant> tenantList = tenantRepository.findAll();

            for (Tenant tenantObj : tenantList) {
                try {
                    TenantContextHolder.setCurrentTenant(tenantObj.getClientId());
                    log.info("Syncing slots for tenant: {}", tenantObj.getClientId());
                    slotService.syncSlotsToMaster(tenantObj.getClientId(), 7);
                } catch (Exception ex) {
                    log.error("❌ Failed to sync slots for tenant: {}", tenantObj.getClientId(), ex);
                }
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to process slot sync for all tenants", e);
        } finally {
            TenantContextHolder.setCurrentTenant(originalTenantContext);
        }
    }
}
