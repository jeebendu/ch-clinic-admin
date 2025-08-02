package com.jee.clinichub.app.appointment.requests.controller;

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

import com.jee.clinichub.app.appointment.requests.model.RequestDto;
import com.jee.clinichub.app.appointment.requests.model.RequestProj;
import com.jee.clinichub.app.appointment.requests.model.RequestSearch;
import com.jee.clinichub.app.appointment.requests.model.StatusDto;
import com.jee.clinichub.app.appointment.requests.service.RequestService;
import com.jee.clinichub.app.patient.model.PatientSearch;
import com.jee.clinichub.global.model.Status;
import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/request")
public class RequestController {

    @Autowired
    private RequestService requestService;

    @Cacheable(value = "requestCache", keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value = "/list")
    public List<RequestDto> getAllRequest() {
        return requestService.getAllRequest();
    }

    @Cacheable(value = "requestCache", keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value = "/id/{id}")
    public RequestDto getById(@PathVariable Long id) {
        return requestService.getById(id);
    }

    @CacheEvict(value = "requestCache", allEntries = true, keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value = "/saveOrUpdate")
    @ResponseBody
    public Status saveRequest(@RequestBody @Valid RequestDto requestDto, Errors errors) {
        return requestService.saveOrUpdate(requestDto);
    }

    @CacheEvict(value = "requestCache", allEntries = true, keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value = "/delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
        return requestService.deleteById(id);
    }


    @PostMapping(value = "/status/id/{id}")
    public Status isAccept(@PathVariable Long id, @RequestBody StatusDto statusDto) {
        return requestService.isAccept(id, statusDto);
    }

    @CacheEvict(value = "requestCache", allEntries = true, keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value = "/filter/{pageNo}/{pageSize}")
    public Page<RequestProj> search(@RequestBody RequestSearch search, @PathVariable int pageNo,
            @PathVariable int pageSize) {
        return requestService.search(search, pageNo, pageSize);
    }

    @CacheEvict(value = "requestCache", allEntries = true, keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value = "/re-schedule")
    @ResponseBody
    public Status reScheduleAppointment(@RequestBody @Valid RequestDto requestDto, Errors errors) {
        return requestService.reSchedule(requestDto);
    }



    @CacheEvict(value = "requestCache", allEntries = true, keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value = "/public/save")
    @ResponseBody
    public Status publicRequestSave(@RequestBody @Valid RequestDto requestDto, Errors errors) {
        return requestService.publicRequestSave(requestDto);
    }

}
