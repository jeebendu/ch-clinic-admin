package com.jee.clinichub.config.schedule;

import java.util.List;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.jee.clinichub.global.tenant.context.TenantContextHolder;
import com.jee.clinichub.global.tenant.model.Tenant;
import com.jee.clinichub.global.tenant.repository.TenantRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class DoctorSlotSchedulerService {

    private final TenantRepository tenantRepository;
    private final DoctorSlotSchedulerSync doctorSlotSchedulerSync;

    //@Scheduled(cron = "0 * * * * *")
    public void generateSlots() {
        String originalTenantContext = TenantContextHolder.getCurrentTenant();
        try {
            List<Tenant> tenantList = tenantRepository.findAll();

            for (Tenant tenantObj : tenantList) {
                TenantContextHolder.setCurrentTenant(tenantObj.getClientId());
                doctorSlotSchedulerSync.generateSlots(tenantObj.getClientId());
                doctorSlotSchedulerSync.releaseSlotToMaster(tenantObj.getClientId());
            }

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to sync slots to master schema for GlobalDoctorBranchId: ");
        } finally {
            TenantContextHolder.setCurrentTenant(originalTenantContext);
        }
    }

}
