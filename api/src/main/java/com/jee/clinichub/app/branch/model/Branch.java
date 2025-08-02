package com.jee.clinichub.app.branch.model;

import java.io.Serializable;
import java.util.UUID;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.jee.clinichub.app.admin.clinic.allclinic.model.Clinic;
import com.jee.clinichub.app.core.district.model.District;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Builder
@ToString(exclude = "clinic")
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
@Entity
@Table(name = "branch")
@EqualsAndHashCode
@EntityListeners(AuditingEntityListener.class)
public class Branch extends Auditable<String> implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name = "global_branch_id", updatable = false, nullable = false, unique = true)
	private UUID globalBranchId;

	@Column(name = "name")
	private String name;

	@Column(name = "code")
	private String code;

	@Column(name = "location")
	private String location;

	@Column(name = "is_active")
	private boolean active;

	@OneToOne
	@JoinColumn(name = "district_id")
	private District district;

	@JsonBackReference
    @ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "clinic_id", nullable = true)
	private Clinic clinic;

	@Column(name = "city")
	private String city;

	@Column(name = "mapurl")
	private String mapurl;

	@Column(name = "pincode")
	private Integer pincode;

	@Column(name = "image")
	private String image;

	@Column(name = "latitude")
	private Double latitude;

	@Column(name = "longitude")
	private Double longitude;

	@Column(name = "is_primary")
	private boolean primary;

	@PrePersist
	public void prePersist() {
		if (this.globalBranchId == null) {
			this.globalBranchId = UUID.randomUUID();
		}
	}

	public Branch(Long branchId) {
		this.id = branchId;
	}

	// Static factory method to create Branch from BranchDto using Builder
	public static Branch fromDto(BranchDto branchDto) {
		// If the DTO has an ID, it means this is an existing entity
		// Return a reference object instead of a fully populated entity
		// to avoid detached entity issues
		if (branchDto.getId() != null) {
			Branch branch = new Branch();
			branch.setId(branchDto.getId());
			branch.setGlobalBranchId(branchDto.getGlobalBranchId());
			return branch;
		}

		// For new entities, create fully populated object
		BranchBuilder builder = Branch.builder()
				.id(branchDto.getId())
				.name(branchDto.getName())
				.code(branchDto.getCode())
				.location(branchDto.getLocation())
				.city(branchDto.getCity())
				.mapurl(branchDto.getMapurl())
				.pincode(branchDto.getPincode())
				.active(branchDto.isActive())
				.primary(branchDto.isPrimary())
				.image(branchDto.getImage())
				.latitude(branchDto.getLatitude())
				.longitude(branchDto.getLongitude());

		// Set globalBranchId only if it's provided (for existing entities)
		if (branchDto.getGlobalBranchId() != null) {
			builder.globalBranchId(branchDto.getGlobalBranchId());
		}

		// Handle district
		if (branchDto.getDistrict() != null) {
			builder.district(branchDto.getDistrict());
		} else {
			builder.district(new District(1L));
		}

		// Handle clinic
		if (branchDto.getClinic() != null) {
			builder.clinic(new Clinic(branchDto.getClinic()));
		}

		return builder.build();
	}

	// Method to update existing entity from DTO
	public Branch updateFromDto(BranchDto branchDto) {
		// globalBranchId is not updatable once set
		this.name = branchDto.getName();
		this.code = branchDto.getCode();
		this.location = branchDto.getLocation();
		this.city = branchDto.getCity();
		this.mapurl = branchDto.getMapurl();
		this.pincode = branchDto.getPincode();
		this.active = branchDto.isActive();
		this.primary = branchDto.isPrimary();
		this.image = branchDto.getImage();
		this.latitude = branchDto.getLatitude();
		this.longitude = branchDto.getLongitude();

		if (branchDto.getDistrict() != null) {
			this.district = branchDto.getDistrict();
		}

		return this;
	}
	
	
	//deprecated
	public Branch(BranchDto branchDto) {
		if(branchDto.getId()==null) {
			this.globalBranchId = UUID.randomUUID();
		}
		this.id = branchDto.getId();
		this.name = branchDto.getName();
		this.code = branchDto.getCode();
		this.location = branchDto.getLocation();
		if(branchDto.getDistrict()==null) {
			this.district = new District(1);
		}else {
			this.district = branchDto.getDistrict();
		}
		
		this.pincode = branchDto.getPincode();
		this.city = branchDto.getCity();
		this.mapurl = branchDto.getMapurl();
		this.active = branchDto.isActive();
		this.image = branchDto.getImage();
		this.latitude = branchDto.getLatitude();
		this.longitude = branchDto.getLongitude();
		this.primary = branchDto.isPrimary();
		if (branchDto.getClinic() != null) {
			this.clinic = new Clinic(branchDto.getClinic());
		}
	}

	public Branch(BranchMaster branchMaster) {
		// TODO Auto-generated constructor stub
	}
}
