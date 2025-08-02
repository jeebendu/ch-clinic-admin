package com.jee.clinichub.app.patient.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.core.model.Search;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.app.patient.model.PatientDto;
import com.jee.clinichub.app.patient.model.PatientOptProj;
import com.jee.clinichub.app.patient.model.PatientProj;
import com.jee.clinichub.app.patient.model.PatientSearch;
import com.jee.clinichub.app.patient.service.PatientService;
import com.jee.clinichub.app.user.model.User;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequestMapping("v1/patient")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @GetMapping(value = "/list")
    public List<PatientProj> getAllPatientes() {
        return patientService.getAllPatients();
    }

    @PostMapping(value = "/list")
    public List<PatientProj> getAllPatientesBySearch(@RequestBody Search search) {
        return patientService.getAllPatients(search);
    }

    @GetMapping(value = "/list/{page}/{size}")
    public Page<PatientProj> getPatientespage(@PathVariable int page, @PathVariable int size) {
        return patientService.getPatientsPage(page, size, null);
    }

    @GetMapping(value = "/list/{page}/{size}/{search}")
    public Page<PatientProj> getPatientespage(@PathVariable int page, @PathVariable int size,
            @PathVariable String search) {
        return patientService.getPatientsPage(page, size, search);
    }

    @PostMapping(value = "/search")
    public List<PatientOptProj> searchPatient(@RequestBody Search search) {
        return patientService.searchPatient(search);
    }

    @Cacheable(value = "patientListCache", keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value = "/id/{id}")
    public PatientDto getById(@PathVariable Long id) {
        return patientService.getById(id);
    }

    @CacheEvict(value = "patientListCache", allEntries = true, keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value = "/saveOrUpdate")
    @ResponseBody
    public Status savePatient(@RequestBody @Valid PatientDto patient, Errors errors) {

        return patientService.saveOrUpdate(patient);
    }


    @CacheEvict(value = "patientListCache", allEntries = true, keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value = "/delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
        return patientService.deleteById(id);
    }

    @PostMapping(value = "/changeBranch/{branchId}")
    public Status changeBranch(@RequestBody Long[] patientIds, @PathVariable Long branchId) {
        return patientService.changeBranch(patientIds, branchId);
    }

    @PostMapping(value = "/filter/{pageNo}/{pageSize}")
    public Page<PatientProj> search(@RequestBody PatientSearch patientSearch, @PathVariable int pageNo,
            @PathVariable int pageSize) {
        return patientService.search(patientSearch, pageNo, pageSize);
    }

    @PostMapping(value = "/admin/filter/{pageNo}/{pageSize}")
    public Page<PatientProj> adminFilter(@RequestBody PatientSearch patientSearch, @PathVariable int pageNo,
            @PathVariable int pageSize) {
        return patientService.adminFilter(patientSearch, pageNo, pageSize);
    }

    @GetMapping(value = "/myprofile")
    public Patient getMyProfile() {
        return patientService.getMyProfile();
    }


    @GetMapping(value = "/phone-email/{phoneNo}")
    public List<PatientDto> getPatientsPhoneByEmail(@PathVariable("phoneNo") String phone) {
        return patientService.getPatientsPhoneByEmail(phone);
    }

}
