package com.jee.clinichub.app.staff.model;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;
import java.util.stream.Collectors;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.user.model.User;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
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
@Table(name = "staff")
@EntityListeners(AuditingEntityListener.class)
public class Staff extends Auditable<String> implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(name = "firstname")
	private String firstname;

	@Column(name = "lastname")
	private String lastname;

	@Column(name = "uid", length = 50)
	private String uid;

	@Temporal(TemporalType.DATE)
	@Column(name = "dob", length = 10)
	private Date dob;

	@Column(name = "age")
	private Integer age;

	@Column(name = "gender")
	private String gender;

	@Column(name = "whatsapp_no", length = 50)
	private String whatsappNo;

	@Column(name = "address")
	private String address;

	@ManyToMany
	@JoinTable(name = "staff_branch", joinColumns = @JoinColumn(name = "staff_id"), inverseJoinColumns = @JoinColumn(name = "branch_id"))
	private Set<Branch> branchList;

	private String profile;

	public Staff(StaffDto staffDto) {
		this.id = staffDto.getId();
		this.uid = staffDto.getUid();
		this.firstname = staffDto.getFirstname();
		this.lastname = staffDto.getLastname();
		this.dob = staffDto.getDob();
		this.age = staffDto.getAge();
		this.gender = staffDto.getGender();
		this.whatsappNo = staffDto.getWhatsappNo();
		this.address = staffDto.getAddress();
		this.user = new User(staffDto.getUser());
		this.profile = staffDto.getProfile();
		if (staffDto.getBranchList() != null) {
			this.branchList = staffDto.getBranchList().stream()
					.map(Branch::new)
					.collect(Collectors.toSet());
		}

	}

	public Staff(long id) {
		this.id = id;
	}

}