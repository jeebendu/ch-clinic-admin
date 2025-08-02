package com.jee.clinichub.app.occTherapist.children;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.core.gender.Gender;
import com.jee.clinichub.app.occTherapist.otChildrenChecklistMap.OtChildrenCheckListMapDto;
import com.jee.clinichub.app.occTherapist.otChildrenChecklistMap.OtChildrenChecklistMap;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;




/**
 * The persistent class for the role database table.
 * 
 */
@Data
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ChildrenDto {
    
    private Long id;
	
	private String firstName;
	private String lastName;
	private Date dob;
	private Date dateOfJoin;
	private Gender genderId;
	private String standard;
	private String school;
	private String diagnosis;
	private String subDiagnosis;
	private String patientName;
	private String contact;
	private String emailId;
	private String photo;
	private String referredBy;
	private String address;
	private String background;
	private String summary;
	private String recomandation;
	private List<OtChildrenCheckListMapDto> childrenCheckListMap=new ArrayList<OtChildrenCheckListMapDto>();
	
	public ChildrenDto (String fname , String lName , List<OtChildrenChecklistMap> childrenCheckListMap) {
		this.firstName = fname;
		this.lastName = lName;
		childrenCheckListMap.forEach(ccmap->{
			OtChildrenCheckListMapDto otChildrenCheckListMapDto = new OtChildrenCheckListMapDto(ccmap);
			this.childrenCheckListMap.add(otChildrenCheckListMapDto);
		});
	}
	
	
	public ChildrenDto(Children children) {
		this.id = children.getId();
		this.firstName = children.getFirstName();
		this.lastName = children.getLastName();
		this.dob = children.getDob();
		this.dateOfJoin = children.getDateOfJoin();
		this.genderId = children.getGenderId();
		this.standard = children.getStandard();
		this.school = children.getSchool();
		this.diagnosis = children.getDiagnosis();
		this.subDiagnosis = children.getSubDiagnosis();
		this.patientName = children.getPatientName();
		this.contact = children.getContact();
		this.emailId = children.getEmailId();
		this.photo = children.getPhoto();
		this.referredBy = children.getReferredBy();
		this.address = children.getAddress();
		this.background = children.getBackground();
		this.summary = children.getSummary();
		this.recomandation = children.getRecomandation();
		
		children.getOtChildrenChecklistMaps().forEach(ccmap->{
			OtChildrenCheckListMapDto otChildrenCheckListMapDto = new OtChildrenCheckListMapDto(ccmap);
			childrenCheckListMap.add(otChildrenCheckListMapDto);
		});
		
		
	}
}