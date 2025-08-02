package com.jee.clinichub.app.admin.clinic.allclinic.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.AmazonServiceException;
import com.jee.clinichub.app.admin.clinic.allclinic.model.Clinic;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicDto;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicMaster;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicMasterDTO;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicPublicViewProj;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicSearch;
import com.jee.clinichub.app.admin.clinic.allclinic.repository.ClinicMasterRepository;
import com.jee.clinichub.app.admin.clinic.allclinic.repository.ClinicRepository;
import com.jee.clinichub.app.admin.clinic.clinicFacility.model.ClinicFacility;
import com.jee.clinichub.app.admin.clinic.clinicType.model.ClinicType;
import com.jee.clinichub.app.core.files.CDNProviderService;
import com.jee.clinichub.app.doctor.service.DoctorServiceImpl;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClinicServiceImpl implements ClinicService {

    private final ClinicRepository clinicRepository;
    private final ClinicMasterRepository clinicTenantRepository;
    private final ClinicSyncService clinicSyncService;
    private final CDNProviderService cdnProviderService;

    @Value("${upload.root.folder}")
    private String TENANT_ROOT;

    public final String FS = "/";

    @Override
    public List<Clinic> getAllClinics() {
        return clinicRepository.findAll();
    }

    @Override
    public List<ClinicMaster> getAllMasterClinic() {
        return clinicTenantRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public ClinicDto getById(Long id) {
        return clinicRepository.findById(id)
                .map(ClinicDto::new)
                .orElseThrow(() -> new EntityNotFoundException("Clinic not found with ID: " + id));
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public Status saveOrUpdate(ClinicDto clinicDto, MultipartFile logo, MultipartFile banner, MultipartFile favicon) {
        String operationTenant = TenantContextHolder.getCurrentTenant();
        String originalTenantContext = TenantContextHolder.getCurrentTenant();
        try {
            TenantContextHolder.setCurrentTenant(operationTenant);

            Clinic clinic = clinicDto.getId() == null ? new Clinic(clinicDto) : setClinic(clinicDto);

            if (logo != null) {
                if (!(logo.isEmpty())) {
                    String image = this.uploadProfile(logo);
                    clinic.setLogo(image);
                }
            }
            if (banner != null) {
                if (!(banner.isEmpty())) {
                    String image = this.uploadProfile(banner);
                    clinic.setBanner(image);
                }
            }
            if (favicon != null) {
                if (!(favicon.isEmpty())) {
                    String image = this.uploadProfile(favicon);
                    clinic.setFavicon(image);
                }
            }

            clinic = clinicRepository.save(clinic);

            if (operationTenant != null) {
                clinicSyncService.syncClinicToMasterIfNeeded(clinic, operationTenant);
            }
            return new Status(true,
                    clinic.getId() == null ? "Clinic saved successfully" : "Clinic updated successfully");
        } catch (Exception e) {
            return new Status(false, "Something went wrong");
        } finally {
            TenantContextHolder.setCurrentTenant(originalTenantContext);
        }
    }

    public Clinic setClinic(ClinicDto clinic) {
        return clinicRepository.findById(clinic.getId()).map(p -> {
            p.setName(clinic.getName());
            p.setEmail(clinic.getEmail());
            p.setContact(clinic.getContact());
            p.setAddress(clinic.getAddress());
            p.setGst(clinic.getGst());
            p.setPan(clinic.getPan());
            p.setOwnerName(clinic.getOwnerName());
            p.setSlug(clinic.getSlug());

            p.setDescription(clinic.getDescription());
            p.setTagline(clinic.getTagline());
            p.setEstablishedYear(clinic.getEstablishedYear());
            p.setWebsite(clinic.getWebsite());
            p.setEmergencyContact(clinic.getEmergencyContact());
            p.setAlternatePhone(clinic.getAlternatePhone());
            p.setLicenseNumber(clinic.getLicenseNumber());
            p.setLicenseAuthority(clinic.getLicenseAuthority());

       
            p.setExistSoftware(clinic.getExistSoftware());
            p.setConsentToContact(clinic.isConsentToContact());
            p.setAcceptTerms(clinic.isAcceptTerms());

            if (clinic.getClinicType() != null) {
                p.setClinicType(new ClinicType(clinic.getClinicType()));
            }
            return p;
        }).orElseThrow(() -> new EntityNotFoundException("Clinic with id" + clinic.getId() + "not found"));

    }

    @Override
    public Status deleteById(Long id) {
        clinicRepository.findById(id).ifPresentOrElse(
                branch -> {
                    clinicRepository.deleteById(id);
                },
                () -> {
                    throw new EntityNotFoundException("Clinic not found with ID: " + id);
                });
        return new Status(true, "Deleted Successfully");
    }

    @Override
    public List<ClinicDto> getByName(ClinicSearch search) {
        try {
            return clinicRepository.filterByname(
                    search.getName() != null ? search.getName() : "").stream().map(ClinicDto::new).toList();

        } catch (Exception e) {
            log.error("Error while fetching clinics by name: " + e.getMessage());
            return new ArrayList<ClinicDto>();
        }
    }

    @Override
    public Page<ClinicPublicViewProj> filterClinic(ClinicSearch search, Pageable pageable) {
        Page<ClinicPublicViewProj> clinicList = Page.empty();
        try {
            String searchKey = search.getSearchKey() != null ? search.getSearchKey() : "";

            clinicList = clinicRepository.filterClinicPublicView(pageable, searchKey);

        } catch (Exception e) {
            log.error("Error while fetching clinics by name: " + e.getMessage());
        }
        return clinicList;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public Status saveOrUpdateMasterClinic(ClinicMasterDTO clinicMaster) {
        try {
            ClinicMaster clinic = clinicMaster.getId() == null ? new ClinicMaster(clinicMaster)
                    : setClinicTenant(clinicMaster);
            clinicTenantRepository.save(clinic);
            return new Status(true,
                    clinic.getId() == null ? "Clinic saved successfully" : "Clinic updated successfully");
        } catch (Exception e) {
            return new Status(false, "Something went wrong");
        }
    }

    public ClinicMaster setClinicTenant(ClinicMasterDTO clinic) {
        return clinicTenantRepository.findById(clinic.getId()).map(p -> {
         p.setName(clinic.getName());
        p.setEmail(clinic.getEmail());
        p.setContact(clinic.getContact());
        p.setAddress(clinic.getAddress());
        p.setGst(clinic.getGst());
        p.setPan(clinic.getPan());
        p.setOwnerName(clinic.getOwnerName());
        // p.setSlug(clinic.getSlug()); // Added

        p.setLogo(clinic.getLogo());       // Added
        p.setBanner(clinic.getBanner());   // Added
        p.setFavicon(clinic.getFavicon()); // Added

        p.setDescription(clinic.getDescription());
        p.setTagline(clinic.getTagline());
        p.setEstablishedYear(clinic.getEstablishedYear());
        p.setWebsite(clinic.getWebsite());
        p.setEmergencyContact(clinic.getEmergencyContact());
        p.setAlternatePhone(clinic.getAlternatePhone());
        p.setLicenseNumber(clinic.getLicenseNumber());
        p.setLicenseAuthority(clinic.getLicenseAuthority());

        if (clinic.getClinicType() != null) {
            p.setClinicType(new ClinicType(clinic.getClinicType()));
        }

        if (clinic.getClinicFacilityList() != null) {
            p.setClinicFacilityList(
                clinic.getClinicFacilityList().stream()
                    .map(ClinicFacility::new)
                    .collect(Collectors.toSet())
            );
        }
            return p;
        }).orElseThrow(() -> new EntityNotFoundException("Clinic with id" + clinic.getId() + "not found"));

    }

    @Override
    public ClinicMasterDTO getForAdminById(Long id) {
        return clinicTenantRepository.findById(id)
                .map(ClinicMasterDTO::new)
                .orElseThrow(() -> new EntityNotFoundException("Clinic not found with ID: " + id));
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Optional<ClinicMaster> findByTenantClientId(String srcTenant) {
        return clinicTenantRepository.findByTenant_clientId(srcTenant);
    }

    public String uploadProfile(MultipartFile multiSlider) {
        try {
            String tenant = TenantContextHolder.getCurrentTenant();
            String tenantPath = TENANT_ROOT + FS + tenant;
            String isPublicOrPrivate = "public";
            String sliderName = String.format("%s", multiSlider.getOriginalFilename());
            String sliderPath = tenantPath + FS + isPublicOrPrivate + FS + sliderName;
            try {
                return cdnProviderService.upload(multiSlider, sliderPath);
            } catch (AmazonServiceException e) {
                log.error(e.getMessage());
                return null;
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }

    }

    @Override
    public ClinicDto findBySlug(String slug) {
        return clinicRepository.findBySlug(slug).map(ClinicDto::new)
                .orElseThrow(() -> new EntityNotFoundException("Clinic not found with Slug: " + slug));
    }

}
