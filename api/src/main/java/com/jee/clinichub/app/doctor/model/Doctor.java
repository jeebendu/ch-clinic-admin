package com.jee.clinichub.app.doctor.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.jee.clinichub.app.core.district.model.District;
import com.jee.clinichub.app.doctor.language.model.Language;
import com.jee.clinichub.app.doctor.percentage.model.Percentage;
import com.jee.clinichub.app.doctor.specialization.model.Specialization;
import com.jee.clinichub.app.user.model.User;
import com.jee.clinichub.config.audit.Auditable;
import com.jee.clinichub.global.utility.SlugUtil;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
@Entity
@Table(name = "doctor")
@EntityListeners(AuditingEntityListener.class)
@EqualsAndHashCode(callSuper = false, exclude = { "percentages", "branchList" })
public class Doctor extends Auditable<String> implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "user_id", nullable = true)
	private User user;

	@Column(name = "uid", length = 50)
	private String uid;

	@Column(name = "desgination")
	private String desgination;

	@Column(name = "is_external")
	private boolean external;

	private String firstname;

	private String lastname;

	private String email;
	private String phone;

	@Column(name = "exp_year")
	private Float expYear;

	@Column(name = "qualification")
	private String qualification;

	private String biography;

	private int gender;

	@Column(name = "is_verified")
	private boolean verified;

	@Column(name = "is_published_online")
	private boolean publishedOnline;

	@Temporal(TemporalType.DATE)
	@Column(name = "joining_date", length = 10)
	private Date joiningDate;

	@Column(name = "about")
	private String about;

	@Column(name = "image")
	private String image;

	@Column(name = "pincode")
	private String pincode;

	@Column(name = "city")
	private String city;

	@Column(name = "slug", unique = true)
	private String slug;

	@OneToOne
	@JoinColumn(name = "district_id")
	private District district;

	@JsonManagedReference
	@OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	private List<Percentage> percentages = new ArrayList<Percentage>();

	@ManyToMany
	@JoinTable(name = "doctor_specialization", joinColumns = @JoinColumn(name = "doctor_id"), inverseJoinColumns = @JoinColumn(name = "specialization_id"))
	private Set<Specialization> specializationList;

	@JsonManagedReference
	@OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	private Set<DoctorBranch> branchList;

	@ManyToMany
	@JoinTable(name = "doctor_language", joinColumns = @JoinColumn(name = "doctor_id"), inverseJoinColumns = @JoinColumn(name = "language_id"))
	private Set<Language> languageList;

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "additional_doctor_id")
	private AdditionalInfoDoctor additionalInfoDoctor;

	private boolean deleted = false;

	@Column(name = "deleted_at")
	private Date deletedAt;

	@Column(name = "deleted_by", length = 100)
	private String deletedBy;

	@Column(name = "global_doctor_id", unique = true)
	private java.util.UUID globalDoctorId;

	@Enumerated(EnumType.STRING)
	@Column(name = "status")
	private DoctorStatus status;

    @Column(name = "cancel_reason")
    private String cancelReason;

	@PrePersist
	public void generateSlugAndGlobalUuid() {
		if (this.slug == null || this.slug.trim().isEmpty()) {
			String fullName = (this.firstname != null ? this.firstname : "") + " "
					+ (this.lastname != null ? this.lastname : "");
			this.slug = SlugUtil.toSlug("dr-" + fullName);
		}
		if (this.globalDoctorId == null) {
			this.globalDoctorId = java.util.UUID.randomUUID();
		}
		if(this.id==null){
			this.status=DoctorStatus.PENDING;
		}
	}

	public Doctor(DoctorDto doctorDto) {
		this.id = doctorDto.getId();
		this.uid = doctorDto.getUid();
		this.lastname = doctorDto.getLastname();
		this.cancelReason=doctorDto.getCancelReason();
		this.firstname = doctorDto.getFirstname();
		if (!doctorDto.isExternal() && doctorDto.getUser() != null) {
			this.user = new User(doctorDto.getUser());
		}
		this.desgination = doctorDto.getDesgination();
		if (doctorDto.getExpYear() != null) {
			this.expYear = doctorDto.getExpYear();
		}
		this.email = doctorDto.getEmail();
		this.publishedOnline = doctorDto.isPublishedOnline();
		this.phone = doctorDto.getPhone();
		this.verified = doctorDto.isVerified();
		this.biography = doctorDto.getBiography();
		this.gender = doctorDto.getGender();
		this.qualification = doctorDto.getQualification();
		this.joiningDate = doctorDto.getJoiningDate();
		this.external = doctorDto.isExternal();
		this.slug = doctorDto.getSlug();

		this.about = doctorDto.getAbout();
		this.image = doctorDto.getImage();
		this.pincode = doctorDto.getPincode();
		this.city = doctorDto.getCity();
		this.district = doctorDto.getDistrict();
		this.status = doctorDto.getStatus();
		this.additionalInfoDoctor = doctorDto.getAdditionalInfoDoctor();

		if (doctorDto.getPercentages() != null || doctorDto.getPercentages().size() != 0) {
			this.percentages = doctorDto.getPercentages().stream().toList();

			if (doctorDto.getSpecializationList() != null) {
				this.specializationList = doctorDto.getSpecializationList().stream().map(Specialization::new)
						.collect(Collectors.toSet());
			}

			if (doctorDto.getLanguageList() != null) {
				this.languageList = doctorDto.getLanguageList().stream().map(Language::new).collect(Collectors.toSet());
			}

			if (doctorDto.getBranchList() != null) {
				this.branchList = doctorDto.getBranchList().stream()
						.map(dto -> new DoctorBranch(dto))
						.collect(Collectors.toSet());

				// Set the doctor reference AFTER mapping to avoid circular issues
				this.branchList.forEach(b -> b.setDoctor(this));
			}

		}
	}

	public static Doctor fromDto(DoctorDto doctorDto) {
		Doctor doctor = new Doctor();
		doctor.setGlobalDoctorId(doctorDto.getGlobalDoctorId());
		doctor.setUid(doctorDto.getUid());
		doctor.setCancelReason(doctorDto.getCancelReason());
		doctor.setFirstname(doctorDto.getFirstname());
		doctor.setLastname(doctorDto.getLastname());
		doctor.setEmail(doctorDto.getEmail());
		doctor.setPhone(doctorDto.getPhone());
		doctor.setGender(doctorDto.getGender());
		doctor.setVerified(doctorDto.isVerified());
		doctor.setBiography(doctorDto.getBiography());
		doctor.setExternal(doctorDto.isExternal());
		doctor.setDesgination(doctorDto.getDesgination());
		doctor.setExpYear(doctorDto.getExpYear());
		doctor.setQualification(doctorDto.getQualification());
		doctor.setJoiningDate(doctorDto.getJoiningDate());
		doctor.setAbout(doctorDto.getAbout());
		doctor.setPublishedOnline(doctorDto.isPublishedOnline());
		doctor.setImage(doctorDto.getImage());
		doctor.setPincode(doctorDto.getPincode());
		doctor.setCity(doctorDto.getCity());
		doctor.setSlug(doctorDto.getSlug());
		doctor.setStatus(DoctorStatus.PENDING);
		doctor.setDistrict(doctorDto.getDistrict());
		// if(doctorDto.getAdditionalInfoDoctor()!=null){
		// 	doctor.setAdditionalInfoDoctor(doctorDto.getAdditionalInfoDoctor());
		// doctor.getAdditionalInfoDoctor().setId(null);
		// }

		if (doctorDto.getPercentages() != null) {
			doctor.setPercentages(doctorDto.getPercentages());
		}

		if (doctorDto.getSpecializationList() != null) {
			doctor.specializationList = doctorDto.getSpecializationList().stream().map(Specialization::new)
					.collect(Collectors.toSet());
		}
		if (doctorDto.getLanguageList() != null) {
			doctor.languageList = doctorDto.getLanguageList().stream().map(Language::new).collect(Collectors.toSet());
		}

		return doctor;
	}

	public void updateFromDto(DoctorDto doctorDto) {
		this.setUid(doctorDto.getUid());
		this.setFirstname(doctorDto.getFirstname());
		this.setLastname(doctorDto.getLastname());
		this.setEmail(doctorDto.getEmail());
		this.setCancelReason(doctorDto.getCancelReason());
		this.setPhone(doctorDto.getPhone());
		this.setGender(doctorDto.getGender());
		// this.setVerified(doctorDto.isVerified());
		this.setBiography(doctorDto.getBiography());
		this.setExternal(doctorDto.isExternal());
		this.setDesgination(doctorDto.getDesgination());
		this.setExpYear(doctorDto.getExpYear());
		this.setQualification(doctorDto.getQualification());
		this.setJoiningDate(doctorDto.getJoiningDate());
		this.setAbout(doctorDto.getAbout());
		this.setPublishedOnline(doctorDto.isPublishedOnline());
		this.setImage(doctorDto.getImage());
		this.setStatus(doctorDto.getStatus());
		this.setPincode(doctorDto.getPincode());
		this.setCity(doctorDto.getCity());
		this.setSlug(doctorDto.getSlug());
		this.setDistrict(doctorDto.getDistrict());
		this.setAdditionalInfoDoctor(doctorDto.getAdditionalInfoDoctor());

		if (doctorDto.getPercentages() != null) {
			this.setPercentages(doctorDto.getPercentages());
		}

		if (doctorDto.getSpecializationList() != null) {
			this.specializationList = doctorDto.getSpecializationList().stream().map(Specialization::new)
					.collect(Collectors.toSet());
		}
		if (doctorDto.getLanguageList() != null) {
			this.languageList = doctorDto.getLanguageList().stream().map(Language::new).collect(Collectors.toSet());
		}

	}
}
