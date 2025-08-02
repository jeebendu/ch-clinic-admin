package com.jee.clinichub.app.patient.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import jakarta.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.core.country.model.CountryDto;
import com.jee.clinichub.app.core.district.model.DistrictDto;
import com.jee.clinichub.app.core.state.model.StateDto;
import com.jee.clinichub.app.doctor.model.DoctorDto;
import com.jee.clinichub.app.enquiryService.model.EnquiryServiceTypeDto;
import com.jee.clinichub.app.user.model.UserDto;

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
public class PatientDto {
    
    private Long id;
    
    @NotNull(message = "Firstname Name is mandatory")
	//@Size(min=3, max=30,message = "Name should between 3 and 30")
    
 
    private BranchDto branch;
	private UserDto user;
	private String uid;
	private String firstname;
	private String lastname;
	private Date dob;
	private DoctorDto refDoctor;
	private Integer age;
	private String gender;
	private String alternativeContact;
	private String whatsappNo;
	private String complaints;
	private String historyOf;
	private String doctorNote;
	private String address;
	private DistrictDto district;
	private String city;
	private PatientSource source;
    private  List<EnquiryServiceTypeDto> enquiryServiceType=new ArrayList<>();
	private java.util.UUID globalPatientId;

	public PatientDto(Patient patient) {
		this.id = patient.getId();
		this.uid = patient.getUid();
		this.firstname = patient.getFirstname();
		this.lastname = patient.getLastname();
		this.dob = patient.getDob();
		this.age = patient.getAge();
		this.gender = patient.getGender();
		this.alternativeContact = patient.getAlternativeContact();
		this.whatsappNo = patient.getWhatsappNo();
		this.address = patient.getAddress();
		this.city = patient.getCity();
		this.globalPatientId=patient.getGlobalPatientId();
		this.source=patient.getSource();

		this.district = Optional.ofNullable(patient.getDistrict()).map(DistrictDto::new).orElse(null);
		this.refDoctor = Optional.ofNullable(patient.getRefDoctor()).map(DoctorDto::new).orElse(null);
		this.user = Optional.ofNullable(patient.getUser()).map(UserDto::new).orElse(null);
		this.branch = Optional.ofNullable(patient.getBranch()).map(BranchDto::new).orElse(null);
	}



	public PatientDto(Long id) {
		super();
		this.id = id;
	}
	

    
    
}