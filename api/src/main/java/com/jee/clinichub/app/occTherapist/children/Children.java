package com.jee.clinichub.app.occTherapist.children;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.core.gender.Gender;
import com.jee.clinichub.app.occTherapist.otChildrenChecklistMap.OtChildrenChecklistMap;
import com.jee.clinichub.config.audit.Auditable;

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
@DynamicUpdate
@Entity
@Table(name = "ot_children")
@EntityListeners(AuditingEntityListener.class)
public class Children extends Auditable<String>  implements Serializable {
	

	private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="first_name")
	private String firstName;
	
	@Column(name="last_name")
	private String lastName;
	
	@Column(name="dob")
	private Date dob;
	
	@Column(name="date_of_join")
	private Date dateOfJoin;
	
	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "gender_id", nullable = false)
	private Gender genderId;
	
	@Column(name="standard")
	private String standard;
	
	@Column(name="school")
	private String school;
	
	@Column(name="diagnosis")
	private String diagnosis;
	
	@Column(name="sub_diagnosis")
	private String subDiagnosis;
	
	@Column(name="patient_name")
	private String patientName;
	
	@Column(name="contact")
	private String contact;
	
	@Column(name="email_id")
	private String emailId;
	
	@Column(name="photo")
	private String photo;
	
	@Column(name="referred_by")
	private String referredBy;

	@Column(name="address")
	private String address;
	
	@Column(name="background")
	private String background;
	
	@Column(name="summary")
	private String summary;
	
	@Column(name="recomandation")
	private String recomandation;
	
	 @OneToMany(fetch = FetchType.EAGER, mappedBy = "children", cascade = CascadeType.ALL)
	 private List<OtChildrenChecklistMap> otChildrenChecklistMaps = new ArrayList<OtChildrenChecklistMap>();
	 
	 public Children(Long id, OtChildrenChecklistMap... oChecklistMaps) {
	        this.id = id;
	        for(OtChildrenChecklistMap oChecklistMap : oChecklistMaps) oChecklistMap.setChildren(this);
	        this.otChildrenChecklistMaps = Stream.of(oChecklistMaps).collect(Collectors.toList());
	    }


	public Children(ChildrenDto childrenDto) {
		super();
		this.id = childrenDto.getId();
		this.firstName = childrenDto.getFirstName();
		this.lastName = childrenDto.getLastName();
		this.dob = childrenDto.getDob();
		this.dateOfJoin = childrenDto.getDateOfJoin();
		this.genderId = childrenDto.getGenderId();
		this.standard = childrenDto.getStandard();
		this.school = childrenDto.getSchool();
		this.diagnosis = childrenDto.getDiagnosis();
		this.subDiagnosis = childrenDto.getSubDiagnosis();
		this.patientName = childrenDto.getPatientName();
		this.contact = childrenDto.getContact();
		this.emailId = childrenDto.getEmailId();
		this.photo = childrenDto.getPhoto();
		this.referredBy = childrenDto.getReferredBy();
		this.address = childrenDto.getAddress();
		this.background = childrenDto.getBackground();
		this.summary = childrenDto.getSummary();
		this.recomandation = childrenDto.getRecomandation();
		
	}


	public Children(String firstName, String lastName) {
		super();
		this.firstName = firstName;
		this.lastName = lastName;
	}
	
	


	
}