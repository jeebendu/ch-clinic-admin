package com.jee.clinichub.app.enquiry.model;

import java.util.Date;

import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.core.country.model.Country;
import com.jee.clinichub.app.core.district.model.District;
import com.jee.clinichub.app.core.source.model.Source;
import com.jee.clinichub.app.core.state.model.State;
import com.jee.clinichub.app.core.status.model.StatusModel;
import com.jee.clinichub.app.enquiryService.model.EnquiryServiceType;
import com.jee.clinichub.app.relationship.model.Relationship;
import com.jee.clinichub.app.staff.model.Staff;



public interface EnquiryProj {

    long getId();
    EnquiryServiceType getEnquiryServiceType();
    String getFirstName();
    String getLastName();
    String getMobile();
    Source getSource();
    Relationship getRelationship();
    String getFollowUpBy();
    StatusModel getStatus();
    Country getCountry();
    String getCity();
    State getState();
    String getCountryCode();
    String getRemark();
    
    String getNeeds();
    String getNotes();
   
    Date getLeadDate();
    District getDistrict();
    Staff getStaff();
    Date getCreatedTime();
    String getCreatedBy();
    Branch getBranch();

    

    
    
}
