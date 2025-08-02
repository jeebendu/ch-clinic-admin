package com.jee.clinichub.app.patient.model;

import java.io.Serializable;
import java.util.Date;
import java.util.Optional;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.core.district.model.District;
import com.jee.clinichub.app.core.district.model.DistrictDto;
import com.jee.clinichub.app.doctor.model.Doctor;
import com.jee.clinichub.app.user.model.User;
import com.jee.clinichub.config.audit.Auditable;

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
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * The persistent class for the role database table.
 * 
 */
@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
@Entity
@Table(name = "patient")
@EntityListeners(AuditingEntityListener.class)
public class Patient extends Auditable<String> implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "branch_id", nullable = false)
	private Branch branch;

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "user_id", nullable = true)
	private User user;

	@OneToOne(optional = true)
	// @Fetch(FetchMode.SELECT)
	@JoinColumn(name = "ref_doctor_id", nullable = true)
	private Doctor refDoctor;

	@Column(name = "uid", length = 50, nullable = true)
	private String uid;

	@Column(name = "firstname")
	private String firstname;

	@Column(name = "lastname")
	private String lastname;

	@Temporal(TemporalType.DATE)
	@Column(name = "dob", length = 10)
	private Date dob;

	@Column(name = "age")
	private Integer age;

	@Column(name = "gender")
	private String gender;

	@Column(name = "alternative_contact", length = 50)
	private String alternativeContact;

	@Column(name = "whatsapp_no", length = 50)
	private String whatsappNo;

	@Column(name = "address")
	private String address;

	@Column(name = "city")
	private String city;

	@OneToOne
	@JoinColumn(name = "district_id", nullable = true)
	private District district;

	@Column(name = "global_patient_id", unique = true)
	private java.util.UUID globalPatientId;

     @Column(name = "source")
    @Enumerated(EnumType.STRING)
	private PatientSource source;

	@PrePersist
	public void generateSlugAndGlobalUuid() {
		if (this.globalPatientId == null) {
			this.globalPatientId = java.util.UUID.randomUUID();
		}
	}

	public Patient(PatientDto patientDto) {
		if (patientDto.getId() != null) {
			this.id = patientDto.getId();
		}
		this.uid = patientDto.getUid();
		this.firstname = patientDto.getFirstname();
		this.lastname = patientDto.getLastname();
		this.dob = patientDto.getDob();
		this.globalPatientId = patientDto.getGlobalPatientId();

		this.age = patientDto.getAge();
		this.gender = patientDto.getGender();
		this.alternativeContact = patientDto.getAlternativeContact();
		this.whatsappNo = patientDto.getWhatsappNo();
		this.address = patientDto.getAddress();
		this.city = patientDto.getCity();
		this.source=patientDto.getSource();

		if (patientDto.getDistrict() != null && !(patientDto.getDistrict().equals(new DistrictDto()))) {
			this.district = new District(patientDto.getDistrict());
		}
		// this.district =
		// Optional.ofNullable(patientDto.getDistrict()).map(District::new).orElse(null);
		// this.state =
		// Optional.ofhNullable(patientDto.getState()).map(State::new).orElse(null);
		// this.country =
		// Optional.ofNullable(patientDto.getCountry()).map(Country::new).orElse(null);

		this.user = Optional.ofNullable(patientDto.getUser()).map(User::new).orElse(null);
		this.refDoctor = Optional.ofNullable(patientDto.getRefDoctor())
				.filter(refDoctorDto -> refDoctorDto.getId() != null)
				.map(Doctor::new)
				.orElse(null);

	}

	public Patient(PatientDto patientDto, boolean isOnlyId) {
		if (isOnlyId) {
			this.id = patientDto.getId();
		}
	}

	public void updateFromDto(PatientDto patientDto) {
		this.setFirstname(patientDto.getFirstname());
		this.setLastname(patientDto.getLastname());
		this.setDob(patientDto.getDob());
		this.setAge(patientDto.getAge());
		this.setGender(patientDto.getGender());
		this.setAlternativeContact(patientDto.getAlternativeContact());
		this.setWhatsappNo(patientDto.getWhatsappNo());
		this.setAddress(patientDto.getAddress());
		this.setCity(patientDto.getCity());
	}

	public static Patient fromDto(PatientDto patientDto) {
		Patient patient = new Patient();

		patient.setUid(patientDto.getUid());
		patient.setFirstname(patientDto.getFirstname());
		patient.setLastname(patientDto.getLastname());
		patient.setDob(patientDto.getDob());
		patient.setAge(patientDto.getAge());
		patient.setGender(patientDto.getGender());
		patient.setGender(patientDto.getGender());
		patient.setSource(patientDto.getSource());
		patient.setAlternativeContact(patientDto.getAlternativeContact());
		patient.setWhatsappNo(patientDto.getWhatsappNo());
		patient.setAddress(patientDto.getAddress());
		patient.setCity(patientDto.getCity());
		patient.setGlobalPatientId(patientDto.getGlobalPatientId());
		if (patientDto.getDistrict() != null) {
			patient.setDistrict(new District(patientDto.getDistrict()));
		}
		return patient;
	}

}
