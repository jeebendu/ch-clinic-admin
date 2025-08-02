
package com.jee.clinichub.app.admin.clinic.allclinic.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.amazonaws.http.conn.ssl.MasterSecretValidators;
import com.jee.clinichub.app.admin.clinic.allclinic.model.Clinic;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicMaster;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicMasterDTO;
import com.jee.clinichub.app.admin.clinic.allclinic.repository.ClinicMasterRepository;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;
import com.jee.clinichub.global.tenant.model.Tenant;
import com.jee.clinichub.global.tenant.model.TenantRequest;
import com.jee.clinichub.global.tenant.service.TenantService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class ClinicSyncService {

    private ClinicService clinicServiceobj;

    @Autowired
    public void setClinicService(@Lazy ClinicService clinicServiceobj) {
        this.clinicServiceobj = clinicServiceobj;
    }

    private final ClinicMasterRepository clinicMasterRepository;
    private final TenantService tenantService;

    @Value("${app.default-tenant}")
    private String defaultTenant;

    // @Transactional(propagation = Propagation.REQUIRES_NEW)
    // public void syncClinicToMasterIfNeeded(Clinic clinic, String sourceTenant) {
    //     if (!sourceTenant.equals(defaultTenant)) {
    //         TenantContextHolder.setCurrentTenant(defaultTenant);
    //         syncClinicToMaster(clinic, sourceTenant);
    //     }
    // }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void syncClinicToMasterIfNeeded(Clinic clinic, String sourceTenant) {

        String originalTenantContext = TenantContextHolder.getCurrentTenant();
        try {
            TenantContextHolder.setCurrentTenant(defaultTenant);
            Tenant tenant = tenantService.findByTenantId(sourceTenant);
            ClinicMasterDTO syncClinic = new ClinicMasterDTO(clinic, tenant);
            Optional<ClinicMaster> existCliniOptional = clinicServiceobj.findByTenantClientId(sourceTenant);

            if (existCliniOptional.isEmpty()) {
                throw new Exception("Your clinic not present at :" + sourceTenant);
            }

            ClinicMaster clinicMaster = existCliniOptional.get();
            clinicMaster.updateFromDto(syncClinic);
            clinicServiceobj.saveOrUpdateMasterClinic(new ClinicMasterDTO(clinicMaster));

            log.info("Successfully synced branch to master schema. GlobalBranchId: {}", clinic.getId());

        } catch (Exception e) {
            log.error(
                    "Error syncing branch to master schema. Branch name: '{}', GlobalBranchId: {}, Source tenant: {}. Error: {}",
                    clinic.getName(), clinic.getId(), sourceTenant, e.getMessage(), e);
            throw new RuntimeException(
                    "Failed to sync branch to master schema for GlobalBranchId: " + clinic.getId(), e);
        } finally {
            TenantContextHolder.setCurrentTenant(originalTenantContext);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Branch syncClinicToTenant(TenantRequest tenantRequest, ClinicMaster clinicMaster, BranchDto branchDto) {
        return null;

    }

}
