
package com.jee.clinichub.app.doctor.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.doctor.language.model.LanguageDto;
import com.jee.clinichub.app.doctor.percentage.model.Percentage;
import com.jee.clinichub.app.doctor.specialization.model.SpecializationDto;
import com.jee.clinichub.app.user.model.UserDto;
import com.jee.clinichub.app.core.district.model.District;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Builder
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DoctorDto {

	private Long id;
	private UserDto user;
	private String uid;
	private String firstname;
	private String lastname;
	private boolean external;
	private String desgination;
	private Float expYear;
	private boolean publishedOnline;
	private String email;
	private String phone;
	private String qualification;
	private Date joiningDate;
	private String about;
	private String image;
	private String pincode;
	private District district;
	private String city;
	private String biography;
	private String slug;
	private int gender;
	private boolean verified;
	private AdditionalInfoDoctor additionalInfoDoctor;
	private UUID globalDoctorId;
	private DoctorStatus status;
	private String cancelReason;
	// String language;
	private List<Percentage> percentages = new ArrayList<Percentage>();

	private Set<SpecializationDto> specializationList;

	private Set<DoctorBranchDto> branchList;

	private Set<LanguageDto> languageList;

	public DoctorDto(Doctor doctor) {
		this.id = doctor.getId();
		this.uid = doctor.getUid();
		this.cancelReason=doctor.getCancelReason();
		this.lastname = doctor.getLastname();
		this.firstname = doctor.getFirstname();
		this.email = doctor.getEmail();
		this.phone = doctor.getPhone();
		this.gender = doctor.getGender();
		this.verified = doctor.isVerified();
		this.biography = doctor.getBiography();
		this.external = doctor.isExternal();
		this.desgination = doctor.getDesgination();
		this.expYear = doctor.getExpYear();
		this.qualification = doctor.getQualification();
		this.joiningDate = doctor.getJoiningDate();
		this.about = doctor.getAbout();
		this.publishedOnline = doctor.isPublishedOnline();
		this.image = doctor.getImage();
		this.pincode = doctor.getPincode();
		this.district = doctor.getDistrict();
		this.city = doctor.getCity();
		this.slug = doctor.getSlug();
		this.status = doctor.getStatus();

		this.additionalInfoDoctor = doctor.getAdditionalInfoDoctor();
		this.globalDoctorId = doctor.getGlobalDoctorId();

		if (doctor.getPercentages() != null || doctor.getPercentages().size() != 0) {
			// this.percentages = doctor.getPercentages().stream().toList();
		}
		if (doctor.getSpecializationList() != null) {
			this.specializationList = doctor.getSpecializationList().stream().map(SpecializationDto::new)
					.collect(Collectors.toSet());
		}
		if (doctor.getLanguageList() != null) {
			this.languageList = doctor.getLanguageList().stream().map(LanguageDto::new).collect(Collectors.toSet());
		}

		if (doctor.getBranchList() != null) {
			this.branchList = doctor.getBranchList().stream().map(DoctorBranchDto::new).collect(Collectors.toSet());
		}
	}
}
