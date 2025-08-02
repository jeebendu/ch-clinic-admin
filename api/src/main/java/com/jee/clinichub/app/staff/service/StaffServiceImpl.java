package com.jee.clinichub.app.staff.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.AmazonServiceException;
import com.jee.clinichub.app.admin.clinic.allclinic.repository.ClinicRepository;
import com.jee.clinichub.app.branch.context.BranchContextHolder;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.branch.repository.BranchRepository;
import com.jee.clinichub.app.branch.service.BranchService;
import com.jee.clinichub.app.core.files.CDNProviderService;
import com.jee.clinichub.app.core.module.model.Module;
import com.jee.clinichub.app.core.module.model.ModuleEnum;
import com.jee.clinichub.app.core.module.repository.ModuleRepository;
import com.jee.clinichub.app.core.sequence.service.SequenceService;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.app.staff.model.Staff;
import com.jee.clinichub.app.staff.model.StaffDto;
import com.jee.clinichub.app.staff.model.StaffProj;
import com.jee.clinichub.app.staff.model.StaffSearch;
import com.jee.clinichub.app.staff.repository.StaffRepository;
import com.jee.clinichub.app.user.model.User;
import com.jee.clinichub.app.user.model.UserDto;
import com.jee.clinichub.app.user.model.UserSearch;
import com.jee.clinichub.app.user.role.model.Role;
import com.jee.clinichub.app.user.role.model.RoleDto;
import com.jee.clinichub.app.user.role.repository.RoleeRepository;
import com.jee.clinichub.app.user.service.UserService;
import com.jee.clinichub.global.context.UserCreationContext;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.security.service.AuthenticationService;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;
import com.jee.clinichub.global.tenant.model.TenantRequest;

import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RequiredArgsConstructor
@Service(value = "staffService")
public class StaffServiceImpl implements StaffService {

	private final StaffRepository staffRepository;
	private final UserService userService;
	private final SequenceService sequenceService;
	private final ModuleRepository moduleRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationService authenticationService;
	private final BranchRepository branchRepository;
	private final BranchService branchService;
	private final RoleeRepository roleeRepository;

	private final CDNProviderService cdnProviderService;

	@Value("${upload.root.folder}")
	private String TENANT_ROOT;

	public final String FS = "/";

	@Value("${app.url.api}")
	private String apiUrl;

	@Override
	// @Transactional(propagation = Propagation.REQUIRES_NEW)
	public Status saveOrUpdate(StaffDto staffDto, MultipartFile profile, UserCreationContext context,
			@Nullable TenantRequest tenantRequest) {
		try {
			log.info("Current Tenant: {}", TenantContextHolder.getCurrentTenant());

			Module module = moduleRepository.findByName(ModuleEnum.users.toString());
			if (module == null) {
				return new Status(false, "1005 : Contact Admin for Sequence");
			}

			Staff staff;
			String nextSequence = null;

			// Validate user
			if (staffDto.getUser() != null) {
				Status userStatus = userService.validateUser(staffDto.getUser());
				if (!userStatus.isStatus()) {
					return userStatus;
				}
			}

			if (staffDto.getId() == null) {
				// New staff creation
				String password = UUID.randomUUID().toString();

				// Resolve branch
				Branch branch = BranchContextHolder.getCurrentBranch();
				if (branch == null || branch.getId() == null) {
					branch = branchRepository.findByPrimary(true)
							.orElseThrow(() -> new RuntimeException("Branch not found"));
				} else {
					branch = branchRepository.findById(branch.getId())
							.orElseThrow(() -> new RuntimeException("Branch not found"));
				}

				// Set branch and encoded password
				UserDto userDto = staffDto.getUser();
				if (staffDto.getUser().getBranch() != null && staffDto.getUser().getBranch().getId() != null
						&& staffDto.getUser().getBranch().getClinic() != null
						&& staffDto.getUser().getBranch().getClinic().getId() != null) {
					userDto.setBranch((staffDto.getUser().getBranch()));
				} else {
					userDto.setBranch(new BranchDto(branch));
				}

				userDto.setPassword(passwordEncoder.encode(password));
				staffDto.setUser(userDto);

				staff = new Staff(staffDto);

				// Create user entity
				User user = userService.UserDtoMaptoUser(userDto);
				user.setStaff(staff);
				user.setEffectiveFrom(new Date());
				staff.setUser(user);

				if (user.getBranch() == null)
					user.setBranch(branch);

				nextSequence = sequenceService.getNextSequense(user.getBranch().getId(), module.getId());
				staff.setUid(nextSequence);

			} else {
				// Update existing staff
				staff = setStaff(staffDto);
			}

			if (profile != null) {
				if (!(profile.isEmpty())) {
					String image = this.uploadProfile(profile);
					staff.setProfile(image);
				}
			}
			log.info("Saving staff for tenant: {}", TenantContextHolder.getCurrentTenant());
			staff = staffRepository.save(staff);

			if (staffDto.getId() == null) {
				// Increment sequence for new staff
				sequenceService.incrementSequense(staffDto.getUser().getBranch().getId(),
						module.getId(), nextSequence);

				// Handle email based on context
				switch (context) {
					case FIRST_TIME_ADMIN:
						authenticationService.sendFirstTimeUserCreation(staff.getUser());
						break;

					case TENANT_APPROVAL:
						if (tenantRequest == null) {
							return new Status(false, "TenantRequest is required for TENANT_APPROVAL email");
						}
						authenticationService.sendClinicApprovalAndAdminUserEmail(staff.getUser(), tenantRequest);
						break;

					case NORMAL_USER:
					default:
						authenticationService.sendFirstTimeUserCreation(staff.getUser());
						break;
				}
			}

			return new Status(true, (staffDto.getId() == null ? "Added" : "Updated") + " Successfully");

		} catch (Exception e) {
			log.error("Error saving staff: {}", e.getMessage(), e);
			return new Status(false, "Something went wrong");
		}
	}

	private Staff setStaff(StaffDto staffDto) {
		Staff exStaff = staffRepository.findById(staffDto.getId()).get();
		exStaff.setAddress(staffDto.getAddress());
		exStaff.setAge(staffDto.getAge());
		exStaff.setDob(staffDto.getDob());
		exStaff.setGender(staffDto.getGender());
		exStaff.setUid(staffDto.getUid());
		exStaff.setWhatsappNo(staffDto.getWhatsappNo());
		exStaff.setFirstname(staffDto.getFirstname());
		exStaff.setLastname(staffDto.getLastname());

		if (staffDto.getBranchList() != null) {
			var branchs = staffDto.getBranchList().stream()
					.map(Branch::new)
					.collect(Collectors.toSet());
			exStaff.setBranchList(branchs);
		}

		User user = userService.setUser(staffDto.getUser(), exStaff.getUser());
		user.setStaff(exStaff);
		exStaff.setUser(user);
		return exStaff;

	}

	@Override
	public List<StaffProj> getAllStaffs() {
		Branch branch = BranchContextHolder.getCurrentBranch();
		List<StaffProj> staffList = staffRepository.findAllProjectedByUser_Branch_Id(branch.getId());
		return staffList;
	}

	@Override
	public Staff findByName(String name) {
		// Staff staff = staffRepository.findStaffByFirstName(name);
		return null;
	}

	@Override
	public StaffDto getById(Long id) {
		StaffDto staffDto = new StaffDto();
		try {
			Optional<Staff> staff = staffRepository.findById(id);
			if (staff.isPresent()) {
				staffDto = new StaffDto(staff.get());
			}
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return staffDto;
	}

	@Override
	public Status deleteById(Long id) {
		try {
			Optional<Staff> staff = staffRepository.findById(id);
			if (!staff.isPresent()) {
				return new Status(false, "Staff Not Found");
			}

			// Delete the staff
			staffRepository.deleteById(id);

			return new Status(true, "Deleted Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");
	}

	@Override
	public Page<StaffProj> getStaffPage(int page, int size, StaffSearch search) {
		Pageable pr = PageRequest.of(page, size);
		String seachVal = search.getSearch() != null ? search.getSearch() : "";
		return staffRepository.findStaffPage(pr, seachVal);

	}

	@Override
	public Page<StaffProj> search(UserSearch userSearch, int pageNo, int pageSize) {
		Branch branch = BranchContextHolder.getCurrentBranch();
		Pageable pr = PageRequest.of(pageNo, pageSize);

		return staffRepository.filter(
				pr,
				branch.getId(),
				userSearch.getRole() != null ? userSearch.getRole() : null,
				userSearch.getInputValue() != null ? userSearch.getInputValue() : null
		// userSearch.getEffectiveFrom()!= null ? userSearch.getEffectiveFrom() : null,
		// userSearch.getEffectiveTo()!= null ? userSearch.getEffectiveTo() : null
		// userSearch.getStatus()!= null ? userSearch.getStatus() : null,

		);
	}

	@Override
	// @Transactional(propagation = Propagation.REQUIRES_NEW)
	public void createStaffFromTenantRequest(TenantRequest tenantRequest, Branch branch) {
		log.info("Creating staff from tenant request for tenant: {}", TenantContextHolder.getCurrentTenant());
		try {
			StaffDto staff = new StaffDto();
			// Parse contact name
			String firstName = tenantRequest.getContactName().split(" ")[0];
			String lastName = "";
			if (tenantRequest.getContactName().split(" ").length > 1) {
				lastName = tenantRequest.getContactName().split(" ")[1];
			}

			staff.setFirstname(firstName);
			staff.setLastname(lastName);
			staff.setBranchList(Set.of(new BranchDto(branch)));
			staff.setWhatsappNo(tenantRequest.getContact());

			// Create user data
			UserDto user = new UserDto();
			user.setUsername(tenantRequest.getEmail());
			user.setEmail(tenantRequest.getEmail());
			user.setPhone(tenantRequest.getContact());
			user.setName(tenantRequest.getContactName());

			// Find Admin role and set it
			Role role = roleeRepository.findByName("Admin");
			if (role == null) {
				log.error("Admin role not found in tenant schema: {}", TenantContextHolder.getCurrentTenant());
				throw new RuntimeException("Admin role not found. Please check data initialization.");
			}

			user.setRole(new RoleDto(role));
			user.setBranch(new BranchDto(branch));
			staff.setUser(user);

			// Save the staff with user
			log.info("Saving new admin staff user with username: {}", user.getUsername());
			Status status = this.saveOrUpdate(staff, null, UserCreationContext.TENANT_APPROVAL, tenantRequest);

			if (!status.isStatus()) {
				log.error("Failed to create staff: {}", status.getMessage());
				throw new RuntimeException("Failed to create staff: " + status.getMessage());
			}
			log.info("Staff created successfully");

		} catch (Exception e) {
			log.error("Error creating staff from tenant request: {}", e.getMessage(), e);
			throw new RuntimeException("Error creating staff from tenant request: " + e.getMessage(), e);
		}
	}

	@Override
	public StaffProj getMyProfile() {
		try {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			return staffRepository.findByUser_username(authentication.getName());
		} catch (Exception e) {
			throw new RuntimeException("Something went wrong");
		}
	}

	public String uploadProfile(MultipartFile multiSlider) {
		try {
			String tenant = TenantContextHolder.getCurrentTenant();
			String tenantPath = TENANT_ROOT + FS + tenant;
			String isPublicOrPrivate = "public";
			String sliderName = String.format("%s", multiSlider.getOriginalFilename());
			String sliderPath = tenantPath + FS + isPublicOrPrivate + FS + sliderName;
			try {
				return cdnProviderService.upload(multiSlider, sliderPath);
			} catch (AmazonServiceException e) {
				log.error(e.getMessage());
				return null;
			}
		} catch (Exception e) {
			log.error(e.getMessage());
			return null;
		}

	}

}
