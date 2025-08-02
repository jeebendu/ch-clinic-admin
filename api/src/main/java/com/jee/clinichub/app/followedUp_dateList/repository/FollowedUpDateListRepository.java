package com.jee.clinichub.app.followedUp_dateList.repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.followedUp_dateList.model.FollowedUpDateList;

@Repository
public interface FollowedUpDateListRepository extends JpaRepository<FollowedUpDateList, Long>{

   

    List<FollowedUpDateList> findByEnquiry_idOrderByFollowUpDateDesc(Long enquiryId);

    FollowedUpDateList findByEnquiry_idOrderByCreatedTime(Long eid);

    List<FollowedUpDateList> findByFollowUpBy_idAndNextFollowUpDateBetween(Long staffId, Date startOfDay, Date endOfDay);

	List<FollowedUpDateList> findByFollowUpBy_idAndNextFollowUpDateGreaterThanEqual(Long staffId, Date startOfDay);
    
}
