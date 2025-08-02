
package com.jee.clinichub.app.branch.model;

import java.util.UUID;

import org.springframework.data.history.Revision;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicDto;
import com.jee.clinichub.app.core.district.model.District;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class BranchDto {

	private Long id;

	private UUID globalBranchId;

	@NotNull(message = "Name is mandatory")
	@Size(min = 3, max = 30, message = "Name should between 3 and 30")
	private String name;

	@NotNull(message = "Code is mandatory")
	private String code;

	private String location;
	private String city;
	private String mapurl;
	private Integer pincode;
	private District district;
	private boolean active;
	private String image;
	private Double latitude;
	private Double longitude;
	private ClinicDto clinic;
	private boolean primary;
	private RevisionMetadataDto editVersion;

	public BranchDto(Long id, String name) {
		this.id = id;
		this.name = name;
	}

	public BranchDto(Long id, String name, String code) {
		this.id = id;
		this.name = name;
		this.code = code;
	}

	// Static factory method for creating DTO from Entity using Builder
	public static BranchDto fromBranch(Branch branch) {
		return BranchDto.builder()
				.id(branch.getId())
				.globalBranchId(branch.getGlobalBranchId())
				.name(branch.getName())
				.code(branch.getCode())
				.location(branch.getLocation())
				.district(branch.getDistrict())
				.pincode(branch.getPincode())
				.city(branch.getCity())
				.mapurl(branch.getMapurl())
				.active(branch.isActive())
				.primary(branch.isPrimary())
				.image(branch.getImage())
				.latitude(branch.getLatitude())
				.longitude(branch.getLongitude())
				.clinic(branch.getClinic() != null ? new ClinicDto(branch.getClinic()) : null)
				.build();
	}

	// Static factory method for creating DTO from BranchMaster using Builder
	public static BranchDto fromBranchMaster(BranchMaster branchMaster) {
		return BranchDto.builder()
				.id(branchMaster.getId())
				//.globalBranchId(branchMaster.getGlobalBranchId())
				.name(branchMaster.getName())
				.code(branchMaster.getCode())
				.location(branchMaster.getLocation())
				.district(branchMaster.getDistrict())
				.city(branchMaster.getCity())
				.mapurl(branchMaster.getMapurl())
				.pincode(branchMaster.getPincode())
				.active(branchMaster.isActive())
				.image(branchMaster.getImage())
				.latitude(branchMaster.getLatitude())
				.longitude(branchMaster.getLongitude())
				.build();
	}

	// Method to convert DTO to new Entity using Builder
	public Branch toNewEntity() {
		return Branch.fromDto(this);
	}

	// Method to update existing entity with DTO data
	public Branch updateEntity(Branch existingBranch) {
		return existingBranch.updateFromDto(this);
	}

	public static BranchDto revision(Revision<Long, Branch> revision) {
		BranchDto branchDto = fromBranch(revision.getEntity());
		branchDto.setEditVersion(new RevisionMetadataDto(revision.getMetadata()));
		return branchDto;
	}

	// New static factory method to avoid circular dependency
	public static BranchDto fromBranchWithoutClinic(Branch branch) {
		return BranchDto.builder()
				.id(branch.getId())
				.globalBranchId(branch.getGlobalBranchId())
				.name(branch.getName())
				.code(branch.getCode())
				.location(branch.getLocation())
				.district(branch.getDistrict())
				.pincode(branch.getPincode())
				.city(branch.getCity())
				.mapurl(branch.getMapurl())
				.active(branch.isActive())
				.primary(branch.isPrimary())
				.image(branch.getImage())
				.latitude(branch.getLatitude())
				.longitude(branch.getLongitude())
				.build();
	}

	// Constructor for backward compatibility - FIXED to use safe factory method
	public BranchDto(Branch branch) {
		BranchDto safeDto = fromBranchWithoutClinic(branch);
		this.id = safeDto.getId();
		this.globalBranchId = safeDto.getGlobalBranchId();
		this.name = safeDto.getName();
		this.code = safeDto.getCode();
		this.location = safeDto.getLocation();
		this.district = safeDto.getDistrict();
		this.city = safeDto.getCity();
		this.mapurl = safeDto.getMapurl();
		this.pincode = safeDto.getPincode();
		this.active = safeDto.isActive();
		this.image = safeDto.getImage();
		this.latitude = safeDto.getLatitude();
		this.longitude = safeDto.getLongitude();
		this.clinic = branch.getClinic() != null ? new ClinicDto(branch.getClinic()) : null; // Avoid lazy loading issues
		this.primary = safeDto.isPrimary();
	}

	// Constructor for backward compatibility with BranchMaster
	public BranchDto(BranchMaster branchMaster) {
		this.id = branchMaster.getId();
		//this.globalBranchId = branchMaster.getGlobalBranchId();
		this.name = branchMaster.getName();
		this.code = branchMaster.getCode();
		this.location = branchMaster.getLocation();
		this.district = branchMaster.getDistrict();
		this.city = branchMaster.getCity();
		this.mapurl = branchMaster.getMapurl();
		this.pincode = branchMaster.getPincode();
		this.active = branchMaster.isActive();
		this.image = branchMaster.getImage();
		this.latitude = branchMaster.getLatitude();
		this.longitude = branchMaster.getLongitude();
	}

	// Safe method to create BranchDto with clinic info when clinic is already loaded
	public static BranchDto fromBranchWithClinic(Branch branch, ClinicDto clinic) {
		BranchDto dto = fromBranchWithoutClinic(branch);
		dto.setClinic(clinic);
		return dto;
	}
}
