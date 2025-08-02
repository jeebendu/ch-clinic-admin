package com.jee.clinichub.app.followedUp_dateList.model;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.enquiry.model.EnquiryDto;
import com.jee.clinichub.app.staff.model.StaffDto;
import com.jee.clinichub.config.audit.AuditableDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FollowedUpDateListDto extends AuditableDto<String>{
    
    private Long id;
	private String remark;
    private Date followUpDate;
	private EnquiryDto enquiry;
     private Date nextFollowUpDate;
     private StaffDto followUpBy;


    public FollowedUpDateListDto(FollowedUpDateList followedUpDateList) {
    	super(followedUpDateList.getCreatedTime(),followedUpDateList.getCreatedBy());
        this.id = followedUpDateList.getId();
        this.remark = followedUpDateList.getRemark();
        this.followUpDate = followedUpDateList.getFollowUpDate();
        this.enquiry = new EnquiryDto(followedUpDateList.getEnquiry());
        this.nextFollowUpDate=followedUpDateList.getNextFollowUpDate();
        
        this.followUpBy=new StaffDto(followedUpDateList.getFollowUpBy());
        
    }
}
