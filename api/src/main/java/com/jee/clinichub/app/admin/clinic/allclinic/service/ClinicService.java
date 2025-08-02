package com.jee.clinichub.app.admin.clinic.allclinic.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.app.admin.clinic.allclinic.model.Clinic;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicDto;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicMaster;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicMasterDTO;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicPublicViewProj;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicSearch;
import com.jee.clinichub.global.model.Status;

public interface ClinicService {
    

    List<Clinic> getAllClinics();
    ClinicDto getById(Long id);
    Status saveOrUpdateMasterClinic(ClinicMasterDTO clinicMasterDTO);
    Status deleteById(Long id);
    List<ClinicDto> getByName(ClinicSearch search);
    Page<ClinicPublicViewProj> filterClinic(ClinicSearch search, Pageable pageable);
    ClinicMasterDTO getForAdminById(Long id);
    List<ClinicMaster> getAllMasterClinic();

    Optional<ClinicMaster>  findByTenantClientId(String srcTenant);
    Status saveOrUpdate(ClinicDto clinic, MultipartFile logo, MultipartFile banner, MultipartFile favicon);
    ClinicDto findBySlug(String slug);

}
