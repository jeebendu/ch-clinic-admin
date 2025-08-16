
package com.jee.clinichub.app.patient.schedule.controller;

import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.branch.context.BranchContextHolder;
import com.jee.clinichub.app.patient.schedule.model.DoctorReferralDto;
import com.jee.clinichub.app.patient.schedule.model.DrReferalSearch;
import com.jee.clinichub.app.patient.schedule.model.Schedule;
import com.jee.clinichub.app.patient.schedule.model.ScheduleDto;
import com.jee.clinichub.app.patient.schedule.model.SearchSchedule;
import com.jee.clinichub.app.patient.schedule.service.ScheduleService;
import com.jee.clinichub.global.model.Status;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/schedule")
public class ScheduleController {
   
    @Autowired
    private ScheduleService scheduleService;

    //@Cacheable(value = "scheduleCache" , keyGenerator = "multiTenantCacheKeyGenerator")
    @GetMapping(value="/list")
    public List<ScheduleDto> getAllSchedulees(){
        return scheduleService.getAllSchedules();
    }

    @PostMapping(value="/list/paginated/{pageNo}/{pageSize}")
    public Page<ScheduleDto> getAllSchedulesPaginated(
            @PathVariable int pageNo, 
            @PathVariable int pageSize,
            @RequestBody(required = false) SearchSchedule search) {
        
        Long branchId = BranchContextHolder.getCurrentBranch().getId();
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        
        return scheduleService.getAllSchedulesPaginated(pageable, branchId, search);
    }
    
    @PostMapping(value="/refdr/list")
    public List<Schedule> getAllScheduleByRefDtos(@RequestBody SearchSchedule search){
        return scheduleService.getAllScheduleByRefDtos(search);
    }
   
    @GetMapping(value="/list/PID/{pid}")
    public List<ScheduleDto> getAllSchedulesByPID(@PathVariable Long pid){
        return scheduleService.getAllSchedulesByPID(pid);
    }
    
    
    @GetMapping(value="/id/{id}")
    public ScheduleDto getById(@PathVariable Long id ){
        return scheduleService.getById(id);
    }
    
    
    @CacheEvict(value="scheduleCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
    @PostMapping(value="/saveOrUpdate")
    @ResponseBody
    public Status saveSchedule(@RequestBody @Valid ScheduleDto schedule,HttpServletRequest request,Errors errors){
        return scheduleService.saveOrUpdate(schedule);
    }
    
   
    @CacheEvict(value="scheduleCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
	@GetMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return scheduleService.deleteById(id);
    }

    @CacheEvict(value="scheduleCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
	@PostMapping(value="/count")
    public List<DoctorReferralDto> countUniqueScheduleByDateAndRefDotor(@RequestBody DrReferalSearch search){
        return scheduleService.countUniqueScheduleByDateAndRefDotor(search);
    }

}
