package com.jee.clinichub.app.doctor.controller;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.app.appointment.appointments.model.AppointmentsDto;
import com.jee.clinichub.app.doctor.model.DoctorBranchDto;
import com.jee.clinichub.app.doctor.model.DoctorBranchProj;
import com.jee.clinichub.app.doctor.model.DoctorDto;
import com.jee.clinichub.app.doctor.model.DoctorProj;
import com.jee.clinichub.app.doctor.model.DoctorSearch;
import com.jee.clinichub.app.doctor.model.DoctorWithOutBranchProj;
import com.jee.clinichub.app.doctor.service.DoctorService;
import com.jee.clinichub.global.model.Status;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("v1/doctor")
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping(value = "/list")
    public List<DoctorProj> getAllDoctores() {
        return doctorService.getAllDoctors();
    }

    @GetMapping(value = "/list/{page}/{size}")
    public Page<DoctorProj> getDoctorsPaged(@PathVariable int page, @PathVariable int size) {
        return doctorService.getDoctorsPaged(page, size, null);
    }

    @GetMapping(value = "/list/{page}/{size}/{search}")
    public Page<DoctorProj> getDoctorsPagedSearch(@PathVariable int page, @PathVariable int size,
            @PathVariable String search) {
        return doctorService.getDoctorsPaged(page, size, search);
    }

    @Cacheable(value = "doctorCache", keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value = "/list/all")
    public List<DoctorProj> getAllDoctorsFromAllBranch() {
        return doctorService.getAllDoctorsFromAllBranch();
    }

    @GetMapping("/slug/{slug}")
    public DoctorDto getDoctorBySlug(@PathVariable String slug) {
        return doctorService.findBySlug(slug);
    }

    @Cacheable(value = "doctorCache", keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value = "/id/{id}")
    public DoctorDto getById(@PathVariable Long id) {
        return doctorService.getById(id);
    }

    @CacheEvict(value = "doctorCache", allEntries = true, keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value = "/saveOrUpdate", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Status saveDoctor(@RequestPart(value = "file") MultipartFile profile,
            @RequestPart("doctor") DoctorDto doctorDto) {
        return doctorService.saveOrUpdate(profile, doctorDto);
    }

    @CacheEvict(value = "doctorCache", allEntries = true, keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value = "/delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
        return doctorService.deleteById(id);
    }

    @GetMapping(value = "/public/list", produces = "application/json")
    public List<DoctorProj> getAllPublicDoctors() {
        return doctorService.getAllDoctors();
    }

    @CacheEvict(value = "doctorCache", allEntries = true, keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value = "/filter/{pageNo}/{pageSize}")
    public Page<DoctorProj> search(@RequestBody DoctorSearch doctorSearch, @PathVariable int pageNo,
            @PathVariable int pageSize) {
        return doctorService.search(doctorSearch, pageNo, pageSize);
    }

    @PostMapping(value = "/admin/filter/{pageNo}/{pageSize}")
    public Page<DoctorWithOutBranchProj> adminSearch(@RequestBody DoctorSearch doctorSearch, @PathVariable int pageNo,
            @PathVariable int pageSize) {
        return doctorService.adminSearch(doctorSearch, pageNo, pageSize);
    }

    @GetMapping(value = "/publish-online/doctor/{id}")
    public Status makeDoctorOnline(@PathVariable Long id) {
        return doctorService.makeDoctorOnline(id);
    }

    @GetMapping(value = "/verify/doctor/{id}")
    public Status verifyDoctor(@PathVariable Long id) {
        return doctorService.verifyDoctor(id);
    }

    @PostMapping(value = "/reject")
    public Status rejectDoctorRequest(@RequestBody DoctorDto doctorDto) {
        return doctorService.rejectDoctorRequest(doctorDto);
    }

    @PostMapping(value = "/doctor-branch/filter")
    public List<DoctorBranchProj> getAllDoctorBranch(@RequestBody DoctorSearch doctorSearch) {
        return doctorService.getAllDoctorBranch(doctorSearch);
    }

    @PostMapping(value = "/clinic-by/filter")
    public List<DoctorProj> getVerifyDoctorForClinicFilter(@RequestBody DoctorSearch doctorSearch) {
        return doctorService.getVerifyDoctorFilter(doctorSearch);
    }

    @GetMapping(value = "/doctor-branch/{drId}/{branchId}")
    public DoctorBranchDto DoctorbranchById(@PathVariable Long drId,@PathVariable Long branchId) {
        return doctorService.DoctorbranchById(drId,branchId);
    }

}
