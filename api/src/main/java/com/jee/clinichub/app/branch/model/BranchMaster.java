
package com.jee.clinichub.app.branch.model;

import java.io.Serializable;
import java.util.UUID;

import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.jee.clinichub.app.admin.clinic.allclinic.model.Clinic;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicMaster;
import com.jee.clinichub.app.core.district.model.District;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * The persistent class for the role database table.
 * 
 */
@Data
// @Audited
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
@Entity
@Table(name = "branch")
@EntityListeners(AuditingEntityListener.class)
public class BranchMaster extends Auditable<String> implements Serializable {

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
	
	@Column(name = "is_primary")
	private boolean primary;

	@OneToOne
	@JoinColumn(name = "district_id")
	private District district;

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

	@OneToOne
	@JoinColumn(name = "clinic_id")
	private ClinicMaster clinicMaster;

	public BranchMaster(Long branchId) {
		this.id = branchId;
	}

	public BranchMaster(BranchDto branchDto) {
		super();
		this.id = branchDto.getId();
		this.globalBranchId = branchDto.getGlobalBranchId();
		this.name = branchDto.getName();
		this.code = branchDto.getCode();
		this.location = branchDto.getLocation();
		this.district = branchDto.getDistrict();
		this.pincode = branchDto.getPincode();
		this.city = branchDto.getCity();
		this.mapurl = branchDto.getMapurl();
		this.active = branchDto.isActive();
		this.image = branchDto.getImage();
		this.latitude = branchDto.getLatitude();
		this.longitude = branchDto.getLongitude();
		if (branchDto.getClinic() != null) {
			//this.clinicMaster = new ClinicMaster(branchDto.getClinic());
		}
	}

	// Builder method to create BranchMaster from BranchDto
	public static BranchMaster fromDto(BranchDto dto, String sourceTenant) {
		return BranchMaster.builder()
				.globalBranchId(dto.getGlobalBranchId())
				.name(dto.getName())
				.code(dto.getCode())
				.location(dto.getLocation())
				.district(dto.getDistrict())
				.city(dto.getCity())
				.mapurl(dto.getMapurl())
				.pincode(dto.getPincode())
				.active(dto.isActive())
				.image(dto.getImage())
				.latitude(dto.getLatitude())
				.longitude(dto.getLongitude())
				.build();
	}

	// Method to update existing BranchMaster from BranchDto
	public void updateFromDto(BranchDto dto, String sourceTenant) {
		// Don't update globalBranchId as it's immutable
		this.name = dto.getName();
		this.code = dto.getCode();
		this.location = dto.getLocation();
		this.district = dto.getDistrict();
		this.city = dto.getCity();
		this.mapurl = dto.getMapurl();
		this.pincode = dto.getPincode();
		this.active = dto.isActive();
		this.image = dto.getImage();
		this.latitude = dto.getLatitude();
		this.longitude = dto.getLongitude();
	}

	// Custom builder method
	public static BranchMaster toEntity(Branch branch) {
		return BranchMaster.builder()
				.id(branch.getId())
				.globalBranchId(branch.getGlobalBranchId())
				.name(branch.getName())
				.code(branch.getCode())
				.location(branch.getLocation())
				.district(branch.getDistrict())
				.city(branch.getCity())
				.mapurl(branch.getMapurl())
				.pincode(branch.getPincode())
				.active(branch.isActive())
				.build();
	}

	public static Branch toEntity(BranchMaster defaultBranch) {
		return null;
	}
}
