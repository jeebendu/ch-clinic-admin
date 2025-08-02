package com.jee.clinichub.app.staff.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.app.doctor.model.DoctorDto;
import com.jee.clinichub.app.staff.model.StaffDto;
import com.jee.clinichub.app.staff.model.StaffProj;
import com.jee.clinichub.app.staff.model.StaffSearch;
import com.jee.clinichub.app.staff.service.StaffService;
import com.jee.clinichub.app.user.model.UserSearch;
import com.jee.clinichub.global.context.UserCreationContext;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/staff")
public class StaffController {

    @Autowired
    private StaffService staffService;

    @GetMapping(value = "/list")
    public List<StaffProj> getAllStaffes() {
        return staffService.getAllStaffs();
    }

    @Cacheable(value = "staffListCache", keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value = "/id/{id}")
    public StaffDto getById(@PathVariable Long id) {
        return staffService.getById(id);
    }

    @CacheEvict(value = "staffListCache", allEntries = true, keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value = "/saveOrUpdate", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseBody
    public Status saveStaff(@RequestPart(value = "profile", required = false) MultipartFile profile,
            @RequestPart("staff") @Valid StaffDto staff, Errors errors) {
        return staffService.saveOrUpdate(staff, profile,
                staff.getId() != null ? UserCreationContext.NORMAL_USER : UserCreationContext.FIRST_TIME_ADMIN,
                null);
    }

    @CacheEvict(value = "staffListCache", allEntries = true, keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value = "/delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
        return staffService.deleteById(id);
    }

    @PostMapping(value = "/list/{page}/{size}")
    public Page<StaffProj> getStaffPage(@PathVariable int page, @PathVariable int size,
            @RequestBody StaffSearch search) {
        return staffService.getStaffPage(page, size, search);
    }

    @PostMapping(value = "/filter/{pageNo}/{pageSize}")
    public Page<StaffProj> searchByBrnachId(@RequestBody UserSearch userSearch, @PathVariable int pageNo,
            @PathVariable int pageSize) {
        return staffService.search(userSearch, pageNo, pageSize);
    }

    @GetMapping(value = "/myprofile")
    public StaffProj getMyProfile() {
        return staffService.getMyProfile();
    }

}
