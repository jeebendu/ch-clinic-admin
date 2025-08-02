package com.jee.clinichub.app.enquiry.model;


import java.util.Date;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.core.country.model.CountryDto;
import com.jee.clinichub.app.core.district.model.DistrictDto;
import com.jee.clinichub.app.core.source.model.SourceDTO;
import com.jee.clinichub.app.core.state.model.StateDto;
import com.jee.clinichub.app.core.status.model.StatusDTO;
import com.jee.clinichub.app.enquiryService.model.EnquiryServiceTypeDto;
import com.jee.clinichub.app.relationship.model.RelationshipDto;
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
public class EnquiryDto extends	AuditableDto<String>{
    
   private Long id;
	private EnquiryServiceTypeDto enquiryServiceType;
	private String firstName;
	private String lastName;
	private String mobile;
	private RelationshipDto relationship;
	
	private Date leadDate;
	private String followUpBy;

	private StatusDTO status;
	private CountryDto country;
	private String city;

	private StateDto state;
	private DistrictDto district;

	private String countryCode;
	private String remark;
	private SourceDTO source;
	private String needs;
	private String notes;
	private StaffDto staff;
	private Date nextFollowedUpDate;
	private BranchDto branch;
    
	public EnquiryDto(Enquiry enquiry) {
		super(enquiry.getCreatedTime(),enquiry.getCreatedBy());
		this.id = enquiry.getId();
		if(enquiry.getEnquiryServiceType()!=null){
			this.enquiryServiceType = new EnquiryServiceTypeDto(enquiry.getEnquiryServiceType());
		}
		
		this.firstName = enquiry.getFirstName();
		this.lastName = enquiry.getLastName();
		this.mobile = enquiry.getMobile();
		if(enquiry.getRelationship()!=null){
			this.relationship = new RelationshipDto(enquiry.getRelationship());
		}
		
		this.leadDate = enquiry.getLeadDate();
		this.followUpBy = enquiry.getFollowUpBy();
		if(enquiry.getStatus()!=null){
			this.status =new StatusDTO( enquiry.getStatus());
		}
		
		if(enquiry.getCountry()!=null){
			this.country =new CountryDto(enquiry.getCountry());
		}
		
		this.city = enquiry.getCity();
		if(enquiry.getState()!=null){
			this.state = new StateDto(enquiry.getState());
		}
		
		this.countryCode = enquiry.getCountryCode();
		this.remark = enquiry.getRemark();
		if(enquiry.getSource()!=null){
			this.source = new SourceDTO(enquiry.getSource());
		}
		
		this.needs = enquiry.getNeeds();
		this.notes = enquiry.getNotes();
		if(enquiry.getStaff() != null)
		this.staff = new StaffDto(enquiry.getStaff());
		if(enquiry.getDistrict()!=null){
			this.district = new DistrictDto(enquiry.getDistrict());
	
		}
		if(enquiry.getBranch()!=null){
            this.branch=new BranchDto(enquiry.getBranch());
        }
			
	}
	

    
    
}