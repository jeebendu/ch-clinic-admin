package com.jee.clinichub.app.admin.clinic.allclinic.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.app.admin.clinic.allclinic.model.Clinic;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicDto;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicMaster;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicMasterDTO;
import com.jee.clinichub.app.admin.clinic.allclinic.service.ClinicService;
import com.jee.clinichub.global.model.Status;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(value = "/v1/clinic")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class ClinicController {

    @Autowired
    private final ClinicService clinicService;

    @GetMapping(value = "/list")
    public List<Clinic> getAllClinics() {
        return clinicService.getAllClinics();
    }

    @GetMapping(value = "/id/{id}")
    public ClinicDto getById(@PathVariable Long id) {
        return clinicService.getById(id);
    }


    @PostMapping(value = "/saveOrUpdate", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Status saveBranch(
            @RequestPart(value = "logo", required = false) MultipartFile logo,
            @RequestPart(value = "banner", required = false) MultipartFile banner,
            @RequestPart(value = "favicon", required = false) MultipartFile favicon,
            @RequestPart("clinic") ClinicDto clinic) {
        return clinicService.saveOrUpdate(clinic,logo,banner,favicon);
    }

    @DeleteMapping(value = "/delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
        return clinicService.deleteById(id);
    }

    @GetMapping(value = "/admin/id/{id}")
    public ClinicMasterDTO getForAdminById(@PathVariable Long id) {
        return clinicService.getForAdminById(id);
    }

    @GetMapping(value = "/admin/list")
    public List<ClinicMaster> getAllMasterClinic() {
        return clinicService.getAllMasterClinic();
    }
}
