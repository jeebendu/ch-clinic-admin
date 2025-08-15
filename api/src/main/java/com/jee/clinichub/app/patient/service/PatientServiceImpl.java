package com.jee.clinichub.app.patient.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicDto;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicMaster;
import com.jee.clinichub.app.admin.clinic.allclinic.repository.ClinicMasterRepository;
import com.jee.clinichub.app.branch.context.BranchContextHolder;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.branch.repository.BranchRepository;
import com.jee.clinichub.app.branch.service.BranchService;
import com.jee.clinichub.app.core.district.model.District;
import com.jee.clinichub.app.core.model.Search;
import com.jee.clinichub.app.core.module.model.Module;
import com.jee.clinichub.app.core.module.model.ModuleEnum;
import com.jee.clinichub.app.core.module.repository.ModuleRepository;
import com.jee.clinichub.app.core.qrcode.QRCodeGenerator;
import com.jee.clinichub.app.core.sequence.service.SequenceService;
import com.jee.clinichub.app.doctor.model.Doctor;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.app.patient.model.PatientDto;
import com.jee.clinichub.app.patient.model.PatientOptProj;
import com.jee.clinichub.app.patient.model.PatientProj;
import com.jee.clinichub.app.patient.model.PatientSearch;
import com.jee.clinichub.app.patient.model.PatientSource;
import com.jee.clinichub.app.patient.repository.PatientRepository;
import com.jee.clinichub.app.user.model.User;
import com.jee.clinichub.app.user.model.UserDto;
import com.jee.clinichub.app.user.repository.UserRepository;
import com.jee.clinichub.app.user.role.model.RoleDto;
import com.jee.clinichub.app.user.role.service.RoleService;
import com.jee.clinichub.app.user.service.UserService;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;
import com.jee.clinichub.global.utility.Base64Converter;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RequiredArgsConstructor
@Service(value = "patientService")
public class PatientServiceImpl implements PatientService {

	private final PatientRepository patientRepository;
	private final BranchRepository branchRepository;
	private final ModuleRepository moduleRepository;
	private final UserService userService;
	private final SequenceService sequenceService;
	private final RoleService roleService;
	private final BranchService branchService;
	private final UserRepository userRepository;
	private final QRCodeGenerator qrCodeGenerator;
	private final ClinicMasterRepository clinicMasterRepository;
	
	@Value("${app.default-tenant}")
    private String defaultTenant;

	@Override
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public Status saveOrUpdate(PatientDto patientDto) {
		try {

			Module module = moduleRepository.findByName(ModuleEnum.patients.toString());
			if (module == null) {
				return new Status(false, "1005 : Contact Admin for Sequense");
			}

			Patient patient = new Patient();
			String nextSequense = null;
			if (patientDto.getId() == null) {
				Branch branch = BranchContextHolder.getCurrentBranch();
				if (branch == null) {
					String currentTenant = TenantContextHolder.getCurrentTenant();
					if (currentTenant.equalsIgnoreCase("master")) {
						branch = branchRepository.findByCode("CHUB")
								.orElseThrow(() -> new RuntimeException("Branch not found"));
						BranchContextHolder.setCurrentBranch(branch);
					}
				} else {
					branch = branchRepository.findById(branch.getId()).get();
				}

				// update branch to model
				UserDto userDto = patientDto.getUser();
				userDto.setName(patient.getFirstname() + " " + patient.getLastname());
				userDto.setBranch(new BranchDto(branch));
				userDto.setRole(new RoleDto(roleService.findByName("Patient")));
				userDto.setUsername(patientDto.getUser().getPhone());
				patientDto.setUser(userDto);

				Branch currentBranch = branchRepository.findById(BranchContextHolder.getCurrentBranch().getId())
						.orElseThrow(() -> new RuntimeException("Branch not found"));

				// Now currentBranch is a managed entity
				// patient.setBranch(currentBranch);

				patient = new Patient(patientDto);
				patient.setBranch(currentBranch);
				patient.setSource(PatientSource.CLINIC);

				Status userStatus = userService.validateUser(patientDto.getUser());
				if (!userStatus.isStatus()) {
					return userStatus;
				}
				User user = userService.UserDtoMaptoUser(patientDto.getUser());
				// user.setName(patientDto.getFirstname() +" "+ patientDto.getLastname());
				user.setPatient(patient);
				// user.setUsername(patientDto.getUser().getPhone());
				patient.setUser(user);
				nextSequense = sequenceService.getNextSequense(user.getBranch().getId(), module.getId());
				patient.setUid(nextSequense);
			} else {
				patient = this.setPatient(patientDto);
			}

			patient = patientRepository.save(patient);

			if (patientDto.getId() == null) {
				sequenceService.incrementSequense(patientDto.getUser().getBranch().getId(),
						module.getId(), nextSequense);
			}

			return new Status(true, ((patientDto.getId() == null) ? "Added" : "Updated") + " Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");

	}

	private Patient setPatient(PatientDto patientDto) {
		Patient exPatient = patientRepository.findById(patientDto.getId()).get();
		exPatient.setFirstname(patientDto.getFirstname());
		exPatient.setAge(patientDto.getAge());
		exPatient.setAlternativeContact(patientDto.getAlternativeContact());
		exPatient.setDob(patientDto.getDob());
		exPatient.setGender(patientDto.getGender());
		exPatient.setLastname(patientDto.getLastname());
		exPatient.setUid(patientDto.getUid());
		exPatient.setWhatsappNo(patientDto.getWhatsappNo());
		exPatient.setAddress(patientDto.getAddress());
		exPatient.setSource(patientDto.getSource());

		exPatient.setDistrict(Optional.ofNullable(patientDto.getDistrict())
				.map(District::new)
				.orElse(null));

		exPatient.setCity(patientDto.getCity());

		exPatient.setRefDoctor(Optional.ofNullable(patientDto.getRefDoctor())
				.filter(refDoctorDto -> refDoctorDto.getId() != null)
				.map(Doctor::new)
				.orElse(null));

		User user = userService.setUser(patientDto.getUser(), exPatient.getUser());
		// user.setUsername(patientDto.getUser().getPhone());
		user.setPatient(exPatient);
		String name=(patientDto.getFirstname()!=null?patientDto.getFirstname().trim():patientDto.getFirstname())+" "+(patientDto.getLastname()!=null?patientDto.getLastname().trim():patientDto.getLastname());
		user.setName(name);
		exPatient.setUser(user);

		return exPatient;
	}

	@Override
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public Status registerPatients(PatientDto patientDto) {
		try {

			boolean isExists = patientRepository.existsByUser_phone(patientDto.getUser().getPhone());
			if (isExists) {
				return new Status(true, "Patient already exists with this phone number");
			}
			if (patientDto.getUser().getEmail() != null) {
				boolean isExistsEmail = patientRepository.existsByUser_phone(patientDto.getUser().getPhone());
				if (isExistsEmail) {
					return new Status(true, "Patient already exists with this email");
				}
			}

			Module module = moduleRepository.findByName(ModuleEnum.patients.toString());
			if (module == null) {
				return new Status(false, "1005 : Contact Admin for Sequense");
			}

			Patient patient = new Patient();
			String nextSequense = null;
			if (patientDto.getId() == null) {

				// update branch to model
				UserDto userDto = patientDto.getUser();
				userDto.setRole(new RoleDto(roleService.findByName("Patient")));
				if (patientDto.getUser().getEmail() != null) {
					userDto.setUsername(patientDto.getUser().getEmail());
				} else {
					userDto.setUsername(patientDto.getUser().getPhone());
				}
				patientDto.setUser(userDto);

				patient = new Patient(patientDto);
				// patient.setBranch(currentBranch);
				Branch currentBranch = BranchContextHolder.getCurrentBranch();
				Branch branch2 = new Branch();
				if (currentBranch != null) {
					Branch currBranch = branchRepository.findById(currentBranch.getId()).get();
					branch2 = currBranch;
				} else {
					Optional<Branch> isExistBranch = branchRepository.findByPrimary(true);
					branch2 = isExistBranch.get();
				}
				patient.setBranch(branch2);
				patient.getUser().setBranch(branch2);
				userDto.setBranch(new BranchDto(branch2));
				patientDto.setUser(userDto);
				patientDto.setBranch(new BranchDto(branch2));

				Status userStatus = userService.validateUser(patientDto.getUser());
				if (!userStatus.isStatus()) {
					return userStatus;
				}
				User user = userService.UserDtoMaptoUser(patientDto.getUser());

				user.setPatient(patient);
				patient.setUser(user);
				nextSequense = sequenceService.getNextSequense(user.getBranch().getId(), module.getId());
				patient.setUid(nextSequense);
			}

			patient = patientRepository.save(patient);

			if (patientDto.getId() == null) {
				sequenceService.incrementSequense(patientDto.getUser().getBranch().getId(),module.getId(), nextSequense);
			}

			return new Status(true, ((patientDto.getId() == null) ? "Added" : "Updated") + " Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");

	}

	@Override
	public List<PatientProj> getAllPatients() {
		Branch branch = BranchContextHolder.getCurrentBranch();
		return patientRepository.findAllProjectedByUser_Branch_idOrderByIdDesc(branch.getId());
	}

	@Override
	public List<PatientProj> getAllPatients(Search search) {
		Branch branch = BranchContextHolder.getCurrentBranch();
		return patientRepository.findAllProjectedByUser_Branch_idOrderByIdDesc(branch.getId());
	}

	@Override
	public List<PatientDto> getPatientsPhoneByEmail(String phone) {
		return patientRepository.findAllByUser_PhoneContainingIgnoreCase(phone).stream().map(PatientDto::new).toList();
	}

	@Override
	public List<PatientOptProj> searchPatient(Search search) {
		return patientRepository
				.findAllProjectedByFirstnameIgnoreCaseContainingOrUser_phoneOrderByFirstnameAsc(search.getName(),
						search.getName());
	}

	@Override
	public Patient findByName(String name) {
		return patientRepository.findPatientByFirstname(name);
	}

	@Override
	public PatientDto getById(Long id) {
		PatientDto patientDto = new PatientDto();
		try {
			Optional<Patient> patient = patientRepository.findById(id);
			if (patient.isPresent()) {
				patientDto = new PatientDto(patient.get());
			}
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return patientDto;
	}

	@Override
	@Transactional
	public Status deleteById(Long id) {
		try {
			Optional<Patient> patient = patientRepository.findById(id);
			if (!patient.isPresent()) {
				return new Status(false, "Patient Not Found");
			}

			patientRepository.deleteById(id);
			return new Status(true, "Deleted Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");
	}

	@Override
	public Page<PatientProj> getPatientsPage(int page, int size, String search) {
		Branch branch = BranchContextHolder.getCurrentBranch();
		Pageable pr = PageRequest.of(page, size);
		if (search == null) {
			return patientRepository.findPagedProjectedByBranch_idOrderByIdDesc(branch.getId(), pr);
		}
		return patientRepository
				.findPagedProjectedByBranch_idAndFirstnameIgnoreCaseContainingOrLastnameIgnoreCaseContainingOrderByIdDesc(
						branch.getId(), pr, search, search);
	}

	@Override
	@Transactional
	public Status changeBranch(Long[] patientIds, Long branchId) {
		try {
			List<Patient> patients = new ArrayList<>();
			for (Long id : patientIds) {
				Optional<Patient> patientOpt = patientRepository.findById(id);
				if (patientOpt.isPresent()) {
					Patient patient = patientOpt.get();
					patient.setBranch(branchRepository.findById(branchId).get());
					patients.add(patient);
				}
			}
			patientRepository.saveAll(patients);
			return new Status(true, "Branch chnaged Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");
	}

	@Override
	public Page<PatientProj> search(PatientSearch search, int pageNo, int pageSize) {
		Branch branch = BranchContextHolder.getCurrentBranch();
		Pageable pr = PageRequest.of(pageNo, pageSize);
		String filter = search.getInputValue() == null ? null : search.getInputValue();
		List<String> genders = search.getGender() == null ? null : search.getGender();
		return patientRepository.search(pr, branch.getId(), filter, genders);
	}

	@Override
	public Patient getMyProfile() {
		try {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			
			// Use the repository method that properly handles JOIN FETCH
			Optional<Patient> patientOpt = patientRepository.findWithBranchByUser_username(authentication.getName());
			
			if (patientOpt.isPresent()) {
				Patient patient = patientOpt.get();
				log.info("Found patient profile for user: {}", authentication.getName());
				return patient;
			} else {
				log.warn("No patient found for username: {}", authentication.getName());
				return null;
			}
		} catch (Exception e) {
			log.error("Error getting patient profile: {}", e.getLocalizedMessage());
			throw new RuntimeException("Something went wrong");
		}
	}

	@Override
	public Page<PatientProj> adminFilter(PatientSearch search, int pageNo, int pageSize) {
		Pageable pr = PageRequest.of(pageNo, pageSize);
		String filter = search.getInputValue() == null ? null : search.getInputValue();
		List<String> genders = search.getGender() == null ? null : search.getGender();
		return patientRepository.adminFilter(pr, filter, genders);
	}

	@Override
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public Patient findPatientByGlobalId(UUID globalPatientId) {
		Optional<Patient> patientOptinal = patientRepository.findByGlobalPatientId(globalPatientId);
		if (patientOptinal.isPresent()) {
			return patientOptinal.get();
		} else {
			return null;
		}
	}
	
	
	/**
	 * Resolves the tenant ID for a given patient.
	 */
	private String resolveTenantId(BranchDto branch) {
	    String tenantId = "";
	    String originalTenantContext = TenantContextHolder.getCurrentTenant();

	    try {
	        if (defaultTenant.equalsIgnoreCase(originalTenantContext)) {
	            // In default tenant → use ClinicMasterRepo
	            ClinicDto clinic = branch.getClinic();
	            if (clinic != null) {
	                Optional<ClinicMaster> clinicMasterOptional = clinicMasterRepository.findById(clinic.getId());
	                if (clinicMasterOptional.isPresent()) {
	                    ClinicMaster clinicMaster = clinicMasterOptional.get();
	                    tenantId = clinicMaster.getTenant().getClientId();
	                }
	            }
	        } else {
	            // In tenant DB → just use current tenant ID
	            tenantId = originalTenantContext;
	        }
	    } catch (Exception e) {
	        log.error("Error resolving tenant ID for patient: {}", e.getMessage(), e);
	    } finally {
	        TenantContextHolder.setCurrentTenant(originalTenantContext); // restore context
	    }

	    return tenantId;
	}
	
	
	/**
	 * Generates QR code for patient.
	 */
	public String generatePatientQRCode(PatientDto patient) {
	    try {
	        // ✅ Reuse tenant resolution
	        String tenantId = resolveTenantId(patient.getBranch());

	        String branchId = patient.getBranch().getGlobalBranchId().toString();

	        Map<String, Object> data = new HashMap<>();
	        data.put("type", "patient");
	        data.put("tenantId", tenantId);
	        data.put("branchId", branchId);
	        data.put("patientId", patient.getId());
	        data.put("patientGlobalId", patient.getGlobalPatientId());
	        data.put("name", patient.getFirstname());
	        data.put("mobile", patient.getUser().getPhone());
	        data.put("dob", patient.getDob() != null ? patient.getDob().toString() : null);
	        data.put("gender", patient.getGender());

	        // Encode JSON to Base64
	        String encoded = Base64Converter.encodeToBase64Json(data);
	        log.info("Encoded Patient QR (base64): {}", encoded);

	        // Generate QR code
	        return qrCodeGenerator.generateQRCodeImage(encoded);

	    } catch (Exception e) {
	        log.error("Error generating patient QR code: {}", e.getMessage(), e);
	        return null;
	    }
	}

}
