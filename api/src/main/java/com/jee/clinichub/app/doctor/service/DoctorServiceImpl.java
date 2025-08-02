package com.jee.clinichub.app.doctor.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.amazonaws.AmazonServiceException;
import com.jee.clinichub.app.branch.context.BranchContextHolder;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.branch.model.BranchMaster;
import com.jee.clinichub.app.branch.repository.BranchMasterRepository;
import com.jee.clinichub.app.branch.repository.BranchRepository;
import com.jee.clinichub.app.core.files.CDNProviderService;
import com.jee.clinichub.app.core.model.Search;
import com.jee.clinichub.app.core.module.model.Module;
import com.jee.clinichub.app.core.module.model.ModuleEnum;
import com.jee.clinichub.app.core.module.repository.ModuleRepository;
import com.jee.clinichub.app.core.sequence.service.SequenceService;
import com.jee.clinichub.app.doctor.language.model.Language;
import com.jee.clinichub.app.doctor.model.Doctor;
import com.jee.clinichub.app.doctor.model.DoctorBranch;
import com.jee.clinichub.app.doctor.model.DoctorBranchDto;
import com.jee.clinichub.app.doctor.model.DoctorBranchProj;
import com.jee.clinichub.app.doctor.model.DoctorClinicMapProjection;
import com.jee.clinichub.app.doctor.model.DoctorDto;
import com.jee.clinichub.app.doctor.model.DoctorProj;
import com.jee.clinichub.app.doctor.model.DoctorSearch;
import com.jee.clinichub.app.doctor.model.DoctorStatus;
import com.jee.clinichub.app.doctor.model.DoctorWithOutBranchProj;
import com.jee.clinichub.app.doctor.model.OnBordingDoctor;
import com.jee.clinichub.app.doctor.model.SearchDoctorView;
import com.jee.clinichub.app.doctor.percentage.model.Percentage;
import com.jee.clinichub.app.doctor.repository.DoctorBranchRepo;
import com.jee.clinichub.app.doctor.repository.DoctorRepository;
import com.jee.clinichub.app.doctor.specialization.model.Specialization;
import com.jee.clinichub.app.user.model.User;
import com.jee.clinichub.app.user.model.UserDto;
import com.jee.clinichub.app.user.role.model.RoleDto;
import com.jee.clinichub.app.user.role.service.RoleService;
import com.jee.clinichub.app.user.service.UserService;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;
import com.jee.clinichub.global.tenant.model.TenantRequestDto;
import com.jee.clinichub.global.tenant.service.TenantService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RequiredArgsConstructor
@Service(value = "doctorService")
public class DoctorServiceImpl implements DoctorService {

	private final DoctorRepository doctorRepository;
	private final UserService userService;
	private final SequenceService sequenceService;
	private final ModuleRepository moduleRepository;
	private final RoleService roleService;
	private final TenantService tenantService;

	private final BranchRepository branchRepository;
	private final BranchMasterRepository branchMasterRepository;
	private final DoctorBranchRepo doctorBranchRepo;

	private final CDNProviderService cdnProviderService;

	@Value("${upload.root.folder}")
	private String TENANT_ROOT;

	public final String FS = "/";

	// Add DoctorSyncService for syncing doctor to master schema after publish
	// online
	private final DoctorSyncService doctorSyncService;

	@Value("${app.default-tenant}")
	private String defaultTenant;

	@PersistenceContext
	private EntityManager entityManager;

	@Override
	@Transactional
	public Status saveOrUpdate(MultipartFile profile, DoctorDto doctorDto) {
		try {

			Module module = moduleRepository.findByName(ModuleEnum.doctor.toString());
			if (module == null) {
				return new Status(false, "1005 : Contact Admin for Sequense");
			}

			Doctor doctor = new Doctor();

			String nextSequense = null;
			if (doctorDto.getId() == null) {
				if (!doctorDto.isExternal()) {
					// update branch to model
					UserDto userDto = doctorDto.getUser();
					userDto.setRole(new RoleDto(roleService.findByName("Doctor")));

					Branch branch = BranchContextHolder.getCurrentBranch();
					if (branch == null) {
						String currentTenant = TenantContextHolder.getCurrentTenant();
						if (currentTenant.equalsIgnoreCase("master")) {
							branch = branchRepository.findByCode("CHUB")
									.orElseThrow(() -> new RuntimeException("Branch not found"));
							BranchContextHolder.setCurrentBranch(branch);
						}
						// log.info("branch Not found");
					}
					branch.setClinic(null);

					userDto.setBranch(new BranchDto(branch));
					userDto.setUsername(doctorDto.getUser().getPhone());
					userDto.setName(doctorDto.getFirstname() + " " + doctorDto.getLastname());
					doctorDto.setUser(userDto);

					List<Percentage> percentages = doctorDto.getPercentages().stream().toList();
					doctor.setPercentages(percentages);

					doctor = new Doctor(doctorDto);

					if (doctorDto.getBranchList() == null || doctorDto.getBranchList().size() <= 0) {
						DoctorBranch drBranchDto = new DoctorBranch();
						drBranchDto.setBranch(branch);
						drBranchDto.setDoctor(doctor);
						doctor.setBranchList(Set.of(drBranchDto));
					}

					Status userStatus = userService.validateUser(doctorDto.getUser());
					if (!userStatus.isStatus()) {
						return userStatus;
					}
					User user = userService.UserDtoMaptoUser(doctorDto.getUser());

					user.setBranch(branch);

					doctor.setUser(user);
					nextSequense = sequenceService.getNextSequense(user.getBranch().getId(), module.getId());
					doctor.setUid(nextSequense);
				} else {

					List<Percentage> percentages = doctorDto.getPercentages().stream().toList();
					doctor.setPercentages(percentages);

					doctor = new Doctor(doctorDto);

					nextSequense = sequenceService.getNextSequense(BranchContextHolder.getCurrentBranch().getId(),
							module.getId());
					doctor.setUid(nextSequense);
				}
			} else {
				doctor = this.setDoctor(doctorDto);
			}

			if (profile != null) {
				if (!(profile.isEmpty())) {
					String image = this.uploadProfile(profile);
					doctor.setImage(image);
					doctor.getUser().setImage(image);
				}
			}

			doctorRepository.save(doctor);

			if (doctorDto.getId() == null) {
				if (!doctorDto.isExternal()) {
					boolean status = sequenceService.incrementSequense(BranchContextHolder.getCurrentBranch().getId(),
							module.getId(), nextSequense);
				} else {
					boolean status = sequenceService.incrementSequense(BranchContextHolder.getCurrentBranch().getId(),
							module.getId(), nextSequense);
				}
			}

		 String currentTenant = TenantContextHolder.getCurrentTenant();
		 if((!currentTenant.equals(defaultTenant) && doctor.isPublishedOnline())){
			TenantContextHolder.setCurrentTenant(defaultTenant);
			 doctorSyncService.syncDoctorUpdateToMaster(new DoctorDto(doctor), currentTenant);
		 }

			return new Status(true, ((doctorDto.getId() == null) ? "Added" : "Updated") + " Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");
	}

	private Doctor setDoctor(DoctorDto doctorDto) {
		Doctor exDoctor = new Doctor();
		try {

			exDoctor = doctorRepository.findById(doctorDto.getId()).get();
			exDoctor.setDesgination(doctorDto.getDesgination());
			exDoctor.setExternal(doctorDto.isExternal());
			exDoctor.setQualification(doctorDto.getQualification());
			exDoctor.setExpYear(doctorDto.getExpYear());
			exDoctor.setFirstname(doctorDto.getFirstname());
			exDoctor.getUser().setName(doctorDto.getFirstname() + " " + doctorDto.getLastname());
			exDoctor.setLastname(doctorDto.getLastname());
			exDoctor.setEmail(doctorDto.getEmail());
			exDoctor.setPhone(doctorDto.getPhone());
			// exDoctor.setBiography(doctorDto.getBiography());
			exDoctor.setAbout(doctorDto.getAbout());
			exDoctor.setCity(doctorDto.getCity());
			exDoctor.setGender(doctorDto.getGender());
			exDoctor.setVerified(doctorDto.isVerified());
			exDoctor.setPublishedOnline(doctorDto.isPublishedOnline());
			exDoctor.setAdditionalInfoDoctor(doctorDto.getAdditionalInfoDoctor());
			exDoctor.setSlug(doctorDto.getSlug());

			if (!doctorDto.isExternal()) {
				if (doctorDto.getUser() != null) {
					UserDto userObj = new UserDto(exDoctor.getUser());
					userObj.setName(doctorDto.getFirstname() + " " + doctorDto.getLastname());
					User user = userService.setUser(userObj, exDoctor.getUser());
					exDoctor.setUser(user);
					user.setDoctor(exDoctor);
				}
			}

			if (doctorDto.getLanguageList() != null) {
				var language = doctorDto.getLanguageList().stream()
						.map(Language::new)
						.collect(Collectors.toSet());
				exDoctor.setLanguageList(language);
			}

			if (doctorDto.getSpecializationList() != null) {
				var specialize = doctorDto.getSpecializationList().stream()
						.map(Specialization::new)
						.collect(Collectors.toSet());
				exDoctor.setSpecializationList(specialize);
			}

			// if (doctorDto.getBranchList() != null) {
			// var specialize = doctorDto.getBranchList().stream()
			// .map(DoctorBranch::new)
			// .collect(Collectors.toSet());
			// exDoctor.setBranchList(specialize);
			// }

			if (doctorDto.getBranchList() != null) {
				Set<DoctorBranch> branches = new HashSet<>();
				for (DoctorBranchDto branchDto : doctorDto.getBranchList()) {
					DoctorBranch drbranch = new DoctorBranch(branchDto);
					drbranch.setDoctor(exDoctor); // Set the existing doctor reference
					branches.add(drbranch);
				}
				exDoctor.setBranchList(branches);
			}

		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return exDoctor;
	}

	@Override
	public List<DoctorProj> getAllDoctors() {
		return doctorRepository.findAlldoctorByBranch(BranchContextHolder.getCurrentBranch().getId());
	}

	@Override
	public Page<DoctorProj> searchDoctor(Pageable pageable, Search search) {

		List<Number> specialIds = new ArrayList<Number>();

		if (search.getSpecializations().size() > 0) {
			search.getSpecializations().stream().forEach(specialization -> {
				specialIds.add(specialization.getId());
			});

		}

		return doctorRepository.doctorFilter(pageable, specialIds);
	}

	@Override
	public Doctor findByName(String name) {
		// Doctor doctor = doctorRepository.findDoctorByFirstName(name);
		return null;
	}

	@Override
	public DoctorDto getById(Long id) {
		DoctorDto doctorDto = new DoctorDto();
		try {
			Optional<Doctor> doctor = doctorRepository.findById(id);
			if (doctor.isPresent()) {
				doctorDto = new DoctorDto(doctor.get());
			}

		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return doctorDto;
	}

	@Override
	public Status deleteById(Long id) {
		try {
			Optional<Doctor> doctorOpt = doctorRepository.findByIdAndDeletedFalse(id);
			if (!doctorOpt.isPresent()) {
				return new Status(false, "Doctor Not Found");
			}
			Doctor doctor = doctorOpt.get();
			doctor.setDeleted(true);
			doctor.setDeletedAt(new java.util.Date());
			doctor.setDeletedBy(SecurityContextHolder.getContext().getAuthentication().getName());
			doctorRepository.save(doctor);

			// If doctor was published online, remove from master schema
			if (doctor.isPublishedOnline() && doctor.getGlobalDoctorId() != null) {
				try {
					String currentTenant = TenantContextHolder.getCurrentTenant();
					doctorSyncService.deleteDoctorFromMaster(doctor.getGlobalDoctorId(), currentTenant);
				} catch (Exception e) {
					log.error("Failed to remove doctor from master schema during delete: {}", e.getMessage());
					// Don't fail the main delete operation
				}
			}

			return new Status(true, "Deleted Successfully (soft delete)");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");
	}

	// Example: Undelete/Restore doctor -- optional utility for admin
	public Status restoreById(Long id) {
		try {
			Optional<Doctor> doctorOpt = doctorRepository.findById(id);
			if (!doctorOpt.isPresent()) {
				return new Status(false, "Doctor Not Found");
			}
			Doctor doctor = doctorOpt.get();
			if (!doctor.isDeleted()) {
				return new Status(false, "Doctor is not deleted");
			}
			doctor.setDeleted(false);
			doctor.setDeletedAt(null);
			doctorRepository.save(doctor);
			// Optionally sync back to master if needed
			return new Status(true, "Doctor restored");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");
	}

	@Override
	public List<DoctorProj> getAllDoctorsFromAllBranch() {
		return doctorRepository.findAllProjectedByOrderByUser_nameAsc();
	}

	@Override
	public Page<DoctorProj> getDoctorsPaged(int page, int size, String search) {
		Branch branch = BranchContextHolder.getCurrentBranch();
		Pageable pr = PageRequest.of(page, size);
		if (search == null) {
			return doctorRepository.findPagedProjectedByUser_Branch_idOrderByIdDesc(branch.getId(), pr);
		}
		return doctorRepository.findPagedProjectedByUser_Branch_idAndUser_NameIgnoreCaseContainingOrderByIdDesc(
				pr, branch.getId(), search);

	}

	@Override
	public Page<DoctorProj> search(DoctorSearch search, int pageNo, int pageSize) {
		Branch branch = BranchContextHolder.getCurrentBranch();
		Pageable pr = PageRequest.of(pageNo, pageSize);
		return doctorRepository.search(pr,
				branch.getId(),
				search.getValue() != null ? search.getValue() : "",
				search.getDoctorType() != null ? search.getDoctorType() : null,
				search.getSpecializationId() != null ? search.getSpecializationId() : null);
	}

	@Transactional
	@Override
	public Status createObBordingDoctor(OnBordingDoctor doctorDto) {
		try {
			if (doctorDto.getId() != null) {
				return new Status(false, "Invalid Request");
			}
			Module module = moduleRepository.findByName(ModuleEnum.doctor.toString());
			if (module == null) {
				return new Status(false, "1005 : Contact Admin for Sequense");
			}
			Doctor doctor = new Doctor();
			String nextSequense = null;

			UserDto userDto = doctorDto.getUser();
			userDto.setRole(new RoleDto(roleService.findByName("Doctor")));
			Branch branch = BranchContextHolder.getCurrentBranch();
			if (branch != null && branch.getId() != null) {
				// branch = branchRepository.findById(branch.getId()).get();
				branch = branchRepository.findByPrimary(true).get();
			} else {
				branch = branchRepository.findByPrimary(true).get();

			}
			userDto.setBranch(new BranchDto(branch));
			userDto.setUsername(doctorDto.getUser().getPhone());
			userDto.setName(doctorDto.getFirstname() + " " + doctorDto.getLastname());
			doctorDto.setUser(userDto);

			List<Percentage> percentages = doctorDto.getPercentages().stream().toList();
			doctor.setPercentages(percentages);

			doctor = new Doctor(doctorDto);

			Set<DoctorBranch> branches = new HashSet<>();
			if (doctorDto.getBranchList() != null || doctorDto.getBranchList().size() > 0) {
				// DoctorBranch drBranch = new DoctorBranch();
				// drBranch.setBranch(branch);
				// drBranch.setDoctor(doctor);
				// doctor.setBranchList(Set.of(drBranch));
				// } else {
				for (DoctorBranchDto branchDto : doctorDto.getBranchList()) {
					Branch currentBranch = branchRepository.findById(branchDto.getBranch().getId()).get();
					DoctorBranch drbranch = new DoctorBranch();
					drbranch.setDoctor(doctor);
					drbranch.setBranch(currentBranch);
					branches.add(drbranch);
				}
				// doctor.setBranchList(branches);
			}

			Status userStatus = userService.validateUser(doctorDto.getUser());
			if (!userStatus.isStatus()) {
				return userStatus;
			}
			User user = userService.UserDtoMaptoUser(doctorDto.getUser());

			user.setDoctor(doctor);

			doctor.setUser(user);
			nextSequense = sequenceService.getNextSequense(user.getBranch().getId(), module.getId());
			doctor.setUid(nextSequense);

			if (doctorDto.getTenantRequest() != null
					&& (branches == null || branches.size() <= 0)) {
				TenantRequestDto tenantRequestDto = doctorDto.getTenantRequest();
				tenantService.request(tenantRequestDto, tenantRequestDto.getName());
			}
			if (doctor.getId() != null) {
				return new Status(false, "Invalid Request");
			}

			doctorRepository.save(doctor);

			boolean status = sequenceService.incrementSequense(branch.getId(),
					module.getId(), nextSequense);

			if (branches != null && branches.size() > 0) {
				for (DoctorBranch drBranch : branches) {
					BranchMaster currentBranch = branchMasterRepository.findById(drBranch.getBranch().getId()).get();
					doctorSyncService.syncDoctorToTenant(new DoctorDto(drBranch.getDoctor()),
							currentBranch.getClinicMaster().getTenant().getClientId(),drBranch);
				}
			}

			return new Status(true, "Onbording created Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");
	}

	@Override
	public Page<DoctorWithOutBranchProj> adminSearch(DoctorSearch search, int pageNo, int pageSize) {
		Pageable pr = PageRequest.of(pageNo, pageSize);
		Page<DoctorWithOutBranchProj> result = Page.empty(pr);
		try {
			result = doctorRepository.adminSearch(pr,
					search.getValue() != null ? search.getValue() : "",
					search.getStatus() != null ? search.getStatus() : null,
					search.getDoctorType() != null ? search.getDoctorType() : null,
					search.getSpecializationId() != null ? search.getSpecializationId() : null);
		} catch (Exception e) {
			log.error("Something went wring");
		}
		return result;
	}

	@Override
	public List<DoctorBranchProj> getAllDoctorBranch(DoctorSearch search) {
		Branch branch = BranchContextHolder.getCurrentBranch();
		List<Long> ids = (search.getSpecializationList() != null && search.getSpecializationList().size() > 0)
				? search.getSpecializationList()
				: null;
		return doctorBranchRepo.getAllDoctorBranch(ids, branch != null ? branch.getId() : null);

	}

	@Override
	public List<DoctorDto> getDoctorsByBranchId(Long branchId) {
		return doctorRepository.getDoctorsByBranchId(branchId).stream().map(DoctorDto::new).toList();
	}

	@Override
	public Page<DoctorClinicMapProjection> filterDoctorPublic(Pageable pageable, SearchDoctorView search) {

		List<Integer> genders = (search.getGenders() == null || search.getGenders().size() <= 0)
				? new ArrayList<Integer>()
				: search.getGenders();

		Page<DoctorClinicMapProjection> x = doctorRepository.filterDoctorPublic(
				genders,
				search.getMinExp() != null ? search.getMinExp() : null,
				search.getMaxExp() != null ? search.getMaxExp() : null,
				search.getSpecializationIds(),
				search.getLanguageIds(),
				search.getSearchText() != null ? search.getSearchText() : null,
				pageable);
		return x;
	}

	@Override
	public DoctorDto findBySlug(String slug) {
		try {
			Optional<Doctor> doctorOptional = doctorRepository.findBySlug(slug);
			if (doctorOptional.isEmpty()) {
				throw new EntityNotFoundException("Exception not found with slug");
			}
			return new DoctorDto(doctorOptional.get());
		} catch (Exception e) {
			log.error("fail to find doctor by slug");
			return null;
		}

	}

	@Override
	@Transactional
	public Status makeDoctorOnline(Long id) {
		try {
			Doctor existDr = doctorRepository.findById(id).orElseThrow(() -> {
				throw new EntityNotFoundException("Doctor not found with id :" + id);
			});

			boolean wasPublishedOnline = existDr.isPublishedOnline();
			existDr.setPublishedOnline(!existDr.isPublishedOnline());
			doctorRepository.save(existDr);

			// Handle sync to master schema
			String currentTenant = TenantContextHolder.getCurrentTenant();
			Branch branch = BranchContextHolder.getCurrentBranch();

			TenantContextHolder.setCurrentTenant(defaultTenant);
			if (existDr.isPublishedOnline() && !existDr.isDeleted()) {
				// Doctor is now published online - sync to master
				try {
					DoctorDto dto = new DoctorDto(existDr);

					Optional<DoctorBranch> matchedDoctorBranch = existDr.getBranchList().stream()
							.filter(db -> db.getDoctor().getGlobalDoctorId().equals(existDr.getGlobalDoctorId())
									&& db.getBranch().getGlobalBranchId().equals(branch.getGlobalBranchId()))
							.findFirst();

					TenantContextHolder.setCurrentTenant(defaultTenant);
					doctorSyncService.syncDoctorToMaster(dto, currentTenant,
							matchedDoctorBranch.get().getGlobalDoctorBranchId());
				} catch (Exception e) {
					log.error("Failed to sync doctor to master schema: {}", e.getMessage());
					// Don't fail the main operation
				}
			} else if (!existDr.isPublishedOnline() && wasPublishedOnline) {
				// Doctor was unpublished - remove from master
				try {
					if (existDr.getGlobalDoctorId() != null) {
						doctorSyncService.deleteDoctorFromMaster(existDr.getGlobalDoctorId(), currentTenant);
					}
				} catch (Exception e) {
					log.error("Failed to remove doctor from master schema: {}", e.getMessage());
					// Don't fail the main operation
				}
			}

			return new Status(true, "Updated successfuly");
		} catch (Exception e) {
			return new Status(false, "Something went wrong");
		}
	}

	@Override
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public Optional<DoctorBranch> findDoctorBranchByGlobalId(UUID globalId) {
		return doctorBranchRepo.findByGlobalDoctorBranchId(globalId);
	}

	@Override
	public Status verifyDoctor(Long id) {
		try {
			Doctor existDr = doctorRepository.findById(id).orElseThrow(() -> {
				throw new EntityNotFoundException("Doctor not found with id :" + id);
			});

			existDr.setVerified(true);
			existDr.setStatus(DoctorStatus.APPROVED);
			// if (!existDr.isVerified()) {
			// existDr.setPublishedOnline(false);
			// }
			doctorRepository.save(existDr);

			// // Handle sync to master schema
			// String currentTenant = TenantContextHolder.getCurrentTenant();
			// Branch branch = BranchContextHolder.getCurrentBranch();

			// TenantContextHolder.setCurrentTenant(defaultTenant);
			// if (existDr.isPublishedOnline() && !existDr.isDeleted()) {
			// // Doctor is now published online - sync to master
			// try {
			// DoctorDto dto = new DoctorDto(existDr);

			// Optional<DoctorBranch> matchedDoctorBranch = existDr.getBranchList().stream()
			// .filter(db ->
			// db.getDoctor().getGlobalDoctorId().equals(existDr.getGlobalDoctorId())
			// && db.getBranch().getGlobalBranchId().equals(branch.getGlobalBranchId()))
			// .findFirst();

			// TenantContextHolder.setCurrentTenant(defaultTenant);
			// doctorSyncService.syncDoctorToMaster(dto, currentTenant,
			// branch.getGlobalBranchId(),
			// matchedDoctorBranch.get().getGlobalDoctorBranchId());
			// } catch (Exception e) {
			// log.error("Failed to sync doctor to master schema: {}", e.getMessage());
			// }
			// } else if (!existDr.isPublishedOnline()) {
			// // Doctor was unpublished - remove from master
			// try {
			// if (existDr.getGlobalDoctorId() != null) {
			// doctorSyncService.deleteDoctorFromMaster(existDr.getGlobalDoctorId(),
			// currentTenant);
			// }
			// } catch (Exception e) {
			// log.error("Failed to remove doctor from master schema: {}", e.getMessage());
			// // Don't fail the main operation
			// }
			// }

			return new Status(true, "Updated successfuly");

		} catch (Exception e) {
			return new Status(true, "Updated successfuly");

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

	@Override
	public List<DoctorProj> getVerifyDoctorFilter(DoctorSearch search) {
		Long clinicId = search.getClinicId() != null ? search.getClinicId() : null;

		List<Long> ids = (search.getSpecializationList() != null && search.getSpecializationList().size() > 0)
				? search.getSpecializationList()
				: null;
		return doctorRepository.getVerifyDoctorForClinicFilter(ids, clinicId);

	}

	@Override
	public Status rejectDoctorRequest(DoctorDto doctorDto) {
		try {
			if (doctorDto.getId() == null) {
				return new Status(false, "Doctor id not found");
			}
			Doctor doctor = doctorRepository.findById(doctorDto.getId()).get();
			if (doctor == null) {
				return new Status(false, "Doctor not found with id: " + doctorDto.getId());
			}
			doctor.setStatus((DoctorStatus.REJECTED));
			doctor.setVerified(false);
			doctor.setPublishedOnline(false);
			doctorRepository.save(doctor);
			return new Status(true, "Doctor request has rejected");

		} catch (Exception e) {
			return new Status(false, "Something went wrong while reject doctor request");
		}
	}

    @Transactional(propagation = Propagation.REQUIRES_NEW)
	@Override
	public Status saveDoctor(Doctor doctor){
		try {
			doctorRepository.save(doctor);
			return new Status(true, "Doctor save");
			
		} catch (Exception e) {
			return new Status(false, "Error while save doctor");
		}
	}
	
	@Override
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public Optional<Doctor> findDoctoryGlobalId(UUID globalId) {
		return doctorRepository.findByGlobalDoctorId(globalId);
	}
	
	@Override
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public Optional<DoctorBranch> doctorBranchByDrAndBranchGlobalId(UUID drGlobalId, UUID branchGlobalId) {
	return doctorBranchRepo.findByDrAndBranchGlobalId(drGlobalId, branchGlobalId);
	}

	@Override
	public DoctorBranchDto DoctorbranchById(Long drId, Long branchId) {
		Optional<DoctorBranch> doctorBranchOpt = doctorBranchRepo.findByDoctor_idAndBranch_id(drId, branchId);
		if (doctorBranchOpt.isPresent()) {
			return new DoctorBranchDto(doctorBranchOpt.get());
		} else {
			throw new EntityNotFoundException("Doctor branch not found for doctor ID: " + drId + " and branch ID: " + branchId);
		}
	}


}
