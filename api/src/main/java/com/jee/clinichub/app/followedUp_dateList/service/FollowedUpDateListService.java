package com.jee.clinichub.app.followedUp_dateList.service;

import java.util.List;


import com.jee.clinichub.app.followedUp_dateList.model.FollowedUpDateListDto;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;

public interface FollowedUpDateListService {

    List<FollowedUpDateListDto> getAllList();

    FollowedUpDateListDto getById(Long id);

    List<FollowedUpDateListDto> getByEnquiryId(Long enquiryId);

    Status saveOrUpdate(@Valid FollowedUpDateListDto followedUpDateList);

    Status deleteById(Long id);

    FollowedUpDateListDto getLatestByEId(Long eid);

    List<FollowedUpDateListDto> getAllListByStaffIdAndToday();
    
}
