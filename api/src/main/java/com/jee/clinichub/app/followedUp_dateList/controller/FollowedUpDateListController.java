package com.jee.clinichub.app.followedUp_dateList.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.enquiry.model.EnquiryDto;
import com.jee.clinichub.app.followedUp_dateList.model.FollowedUpDateListDto;
import com.jee.clinichub.app.followedUp_dateList.service.FollowedUpDateListService;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("v1/followedUpDateList")
public class FollowedUpDateListController {

    @Autowired
    private FollowedUpDateListService followedUpDateListService;

    @GetMapping(value="/list")
    public List<FollowedUpDateListDto> getAllList(){
        return followedUpDateListService.getAllList();
    }

    @GetMapping(value="/dashboard/list")
    public List<FollowedUpDateListDto> getAllListByStaffIdAndToday(){
        return followedUpDateListService.getAllListByStaffIdAndToday();
    }

     @GetMapping(value="/id/{id}")
    public FollowedUpDateListDto getById(@PathVariable Long id ){
        return followedUpDateListService.getById(id);
    }

    @GetMapping(value="/enquiryId/{enquiryId}")
    public List<FollowedUpDateListDto> getByEnquiryId(@PathVariable Long enquiryId ){
        return followedUpDateListService.getByEnquiryId(enquiryId);
    }

    @PostMapping(value="/saveOrUpdate")
    @ResponseBody
    public Status save(@RequestBody @Valid FollowedUpDateListDto followedUpDateList,HttpServletRequest request,Errors errors){
        return followedUpDateListService.saveOrUpdate(followedUpDateList);
    }

    @GetMapping(value="/delete/id/{id}")
    public Status deleteById(@PathVariable Long id ){
        return followedUpDateListService.deleteById(id);
    }
    
    @GetMapping(value="/enquiry/id/{eid}")
    public FollowedUpDateListDto getByEId(@PathVariable Long eid ){
        return followedUpDateListService.getLatestByEId(eid);
    }
}
