
package com.jee.clinichub.global.tenant.service;

import java.util.List;
import java.util.Optional;

import javax.sql.DataSource;

import org.hibernate.internal.SessionFactoryImpl;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.app.admin.clinic.allclinic.model.Clinic;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicMaster;
import com.jee.clinichub.app.admin.clinic.allclinic.repository.ClinicMasterRepository;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.model.BranchDto;
import com.jee.clinichub.app.branch.service.BranchService;
import com.jee.clinichub.app.core.dns.model.Dns;
import com.jee.clinichub.app.core.dns.model.DnsResponse;
import com.jee.clinichub.app.core.dns.service.DnsService;
import com.jee.clinichub.app.core.files.FileService;
import com.jee.clinichub.config.FlywayConfig;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.tenant.context.TenantContextHolder;
import com.jee.clinichub.global.tenant.model.ApprovalProgress;
import com.jee.clinichub.global.tenant.model.ApprovalStep;
import com.jee.clinichub.global.tenant.model.Tenant;
import com.jee.clinichub.global.tenant.model.TenantDto;
import com.jee.clinichub.global.tenant.model.TenantFilter;
import com.jee.clinichub.global.tenant.model.TenantProj;
import com.jee.clinichub.global.tenant.model.TenantRequest;
import com.jee.clinichub.global.tenant.model.TenantRequestDto;
import com.jee.clinichub.global.tenant.model.TenantRequestProj;
import com.jee.clinichub.global.tenant.model.WebInfo;
import com.jee.clinichub.global.tenant.repository.TenantRepository;
import com.jee.clinichub.global.tenant.repository.TenantRequestRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class TenantServiceImpl implements TenantService, TenantApprovalService {

	SessionFactoryImpl sessionFactory;
	private final TenantRepository tenantRepository;
	private final TenantRequestRepository tenantRequestRepository;
	private final DataSource dataSource;
	private final FileService fileService;
	private final SubdomainValidator subdomainValidator;
	private final ClinicMasterRepository clinicMasterRepository;
	private final FlywayConfig flywayConfig;
	private final BranchService branchService;
	private final TenantSyncServiceImpl tenantSyncServiceImpl;
	private final DnsService dnsService;

	@Value("${cloudflare.host}")
	private String hostCloudflare;

	@Value("${cloudflare.zone-id}")
	private String zoneId;

	@Value("${cloudflare.domain}")
	private String domain;

	@Value("${cloudflare.token}")
	private String token;

	@Qualifier("myRestTemplate")
	private final RestTemplate restTemplate;

	public void initDatabase(String schema) {
		log.info("Initializing database schema for tenant: {}", schema);
		try {
			flywayConfig.migrateTenantSchema(dataSource, schema);
			log.info("Database schema initialization completed for tenant: {}", schema);
		} catch (Exception e) {
			log.error("Error initializing database schema for tenant {}: {}", schema, e.getMessage(), e);
			throw e;
		}
	}

	@Transactional
	@Override
	@Deprecated
	public Status createUser(TenantDto tenantDto) {

		if (tenantRepository.existsByClientId(tenantDto.getClientId())) {
			return new Status(false, "Tenant already exist, Please try another.");
		}
		// Save New Tenant
		Tenant tenant = tenantRepository.save(new Tenant(tenantDto));

		// setup new tenant schema
		this.initDatabase(tenantDto.getClientId());

		return new Status(false, "Tenant Created Successfully.");
	}

	@Override
	public void findWebInfoByClientId(String tenant) {
		// TODO Auto-generated method stub

	}

	@Override
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	@Cacheable(value = "tenantCache", keyGenerator = "multiTenantCacheKeyGenerator")
	public Tenant findByTenantId(String tenantOrClientId) {
		Tenant tenant = new Tenant();
		Optional<Tenant> tenantOptional = tenantRepository.findByClientId(tenantOrClientId);
		if (tenantOptional.isPresent()) {
			tenant = tenantOptional.get();
		}
		return tenant;
	}

	@Override
	public Status request(TenantRequestDto tenantRequestDto, String subdomainReq) {
		log.info("request tenant: " + TenantContextHolder.getCurrentTenant());

		if (isExistsByTenantId(tenantRequestDto.getClientId()).isStatus()) {
			return new Status(false, "ClientId already Exist");
		}
		tenantRequestDto.setStatus("Pending");
		boolean isExistEmail = tenantRequestRepository.existsByEmail(tenantRequestDto.getEmail());
		if (isExistEmail) {
			return new Status(false, "Clinic exists with Email: " + tenantRequestDto.getEmail());
		}

		TenantRequest tenantRequest = tenantRequestRepository.save(new TenantRequest(tenantRequestDto));
		// Auto Approve
		// Status apStatus = approve(tenantRequest.getClientId(),subdomainReq);
		// if(!apStatus.isStatus()) {

		// return apStatus;
		// };

		return new Status(true, "successfully registered, please wait for admin approval.");
	}

	@Override
	@Transactional
	public Status approve(Long id, String subdomainReq) {
		return executeApproval(id, subdomainReq);
	}

	@Override
	public Status executeApproval(Long id, String subdomainReq) {
		String originalTenant = TenantContextHolder.getCurrentTenant();
		ApprovalProgress progress = new ApprovalProgress("unknown");

		try {
			log.info("Starting multi-step tenant approval process for request ID: {}", id);

			// Phase 1: Validation & Infrastructure Setup
			executeStep(progress, ApprovalStep.VALIDATION, () -> {
				validateTenantRequest(id, progress);
			});

			// executeStep(progress, ApprovalStep.DNS_CREATION, () -> {
			// createDnsRecordIfNeeded(subdomainReq, progress);
			// });

			executeStep(progress, ApprovalStep.MASTER_SCHEMA_SETUP, () -> {
				createMasterSchemaEntities(progress);
			});

			// Phase 2: Schema Creation
			executeStep(progress, ApprovalStep.TENANT_SCHEMA_CREATION, () -> {
				createTenantSchema(progress);
			});

			// Phase 3: Data Initialization
			executeStep(progress, ApprovalStep.TENANT_DATA_INITIALIZATION, () -> {
				initializeTenantData(progress);
			});

			// Phase 4: Finalization
			executeStep(progress, ApprovalStep.STATUS_UPDATE, () -> {
				updateTenantRequestStatus(progress, "Approved");
			});

			log.info("Multi-step tenant approval completed successfully for client: {}", progress.getClientId());
			return new Status(true, "Clinic approved successfully! You can now log in using your subdomain.");

		} catch (Exception e) {
			log.error("Tenant approval failed for client {}: {}", progress.getClientId(), e.getMessage(), e);
			rollbackApproval(progress);
			return new Status(false,
					"Clinic approval failed at step: " + progress.getCurrentStep() + " - " + e.getMessage());
		} finally {
			TenantContextHolder.setCurrentTenant(originalTenant);
		}
	}

	private void executeStep(ApprovalProgress progress, ApprovalStep step, Runnable stepAction) {
		try {
			progress.setCurrentStep(step);
			log.info("Executing step: {} for client: {}", step.getDescription(), progress.getClientId());

			stepAction.run();

			progress.markStepCompleted(step);
			log.info("Completed step: {} for client: {}", step.getDescription(), progress.getClientId());

		} catch (Exception e) {
			String errorMsg = "Failed at step " + step.getDescription() + ": " + e.getMessage();
			progress.setError(step, errorMsg);
			log.error("Step failed: {} for client: {} - {}", step.getDescription(), progress.getClientId(),
					e.getMessage(), e);
			throw new RuntimeException(errorMsg, e);
		}
	}

	private void validateTenantRequest(Long id, ApprovalProgress progress) {
		Optional<TenantRequest> tenantRequestOptional = tenantRequestRepository.findById(id);
		if (tenantRequestOptional.isEmpty()) {
			throw new RuntimeException("Clinic request not found. Please check the subdomain and try again.");
		}

		TenantRequest tenantRequest = tenantRequestOptional.get();
		progress.setTenantRequest(tenantRequest);
		progress.setClientId(tenantRequest.getClientId());

		if (tenantRepository.existsByClientId(tenantRequest.getClientId())) {
			throw new RuntimeException("This clinic subdomain is already registered. Please choose another.");
		}

		log.info("Tenant request validation completed for client: {}", tenantRequest.getClientId());
	}

	private void createDnsRecordIfNeeded(String subdomainReq, ApprovalProgress progress) {
		if (subdomainReq.contains(domain)) {
			if (!dnsService.createDns(progress.getClientId())) {
				throw new RuntimeException("Unable to create DNS record. Please contact support.");
			}
			log.info("DNS record created for client: {}", progress.getClientId());
		} else {
			log.info("DNS record creation skipped for client: {}", progress.getClientId());
		}
	}

	private void createMasterSchemaEntities(ApprovalProgress progress) {
		TenantRequest tenantRequest = progress.getTenantRequest();

		// Create tenant in master schema
		Tenant savedTenant = createTenantInMasterSchema(tenantRequest);
		progress.setTenantId(savedTenant.getId());

		// Create clinic master in master schema
		ClinicMaster clinicMaster = createClinicInMasterSchema(tenantRequest, savedTenant);
		progress.setClinicMasterId(clinicMaster.getId());

		// Create default branch in master schema
		Branch defaultBranch = branchService.createDefaultBranch("Default", tenantRequest.getClientId() + "-default",
				new Clinic(clinicMaster));

		log.info("Master schema entities created for client: {}", progress.getClientId());
	}

	private void createTenantSchema(ApprovalProgress progress) {
		initDatabase(progress.getClientId());
		log.info("Tenant schema created for client: {}", progress.getClientId());
	}

	private void initializeTenantData(ApprovalProgress progress) {
		try {
			// Switch to new tenant context
			TenantContextHolder.setCurrentTenant(progress.getClientId());

			// Get clinic master and create branch DTO
			ClinicMaster clinicMaster = clinicMasterRepository.findById(progress.getClinicMasterId())
					.orElseThrow(() -> new RuntimeException("ClinicMaster not found"));

			Branch defaultBranch = branchService.createDefaultBranch("Default", progress.getClientId() + "-default",
					new Clinic(clinicMaster));


			// Create clinic and staff in new tenant schema
			tenantSyncServiceImpl.createClinicAndStaffInTenantSchema(progress.getTenantRequest(), clinicMaster,
					new BranchDto(defaultBranch));

			log.info("Tenant data initialized for client: {}", progress.getClientId());

		} catch (Exception ex) {
			log.error("Error during tenant data initialization for {}: {}", progress.getClientId(), ex.getMessage(),
					ex);
			throw ex;
		}
	}

	@CacheEvict(value = "tenantCache", allEntries = true, keyGenerator = "multiTenantCacheKeyGenerator")
	private void updateTenantRequestStatus(ApprovalProgress progress, String status) {
		TenantRequest tenantRequest = progress.getTenantRequest();
		tenantRequest.setStatus(status);
		tenantRequestRepository.save(tenantRequest);
		log.info("Tenant request status updated to {} for client: {}", status, progress.getClientId());
	}

	@Override
	public void rollbackApproval(ApprovalProgress progress) {
		log.warn("Starting rollback process for client: {} at step: {}", progress.getClientId(),
				progress.getCurrentStep());

		try {
			// Rollback based on completed steps
			if (progress.getCompletedSteps().contains(ApprovalStep.DNS_CREATION.name())) {
				try {
					dnsService.deleteDns(progress.getClientId());
					log.info("DNS record deleted during rollback for client: {}", progress.getClientId());
				} catch (Exception e) {
					log.error("Failed to delete DNS record during rollback: {}", e.getMessage());
				}
			}

			if (progress.getTenantId() != null) {
				try {
					tenantRepository.deleteById(progress.getTenantId());
					log.info("Tenant deleted during rollback for client: {}", progress.getClientId());
				} catch (Exception e) {
					log.error("Failed to delete tenant during rollback: {}", e.getMessage());
				}
			}

			if (progress.getClinicMasterId() != null) {
				try {
					clinicMasterRepository.deleteById(progress.getClinicMasterId());
					log.info("ClinicMaster deleted during rollback for client: {}", progress.getClientId());
				} catch (Exception e) {
					log.error("Failed to delete ClinicMaster during rollback: {}", e.getMessage());
				}
			}

		} catch (Exception e) {
			log.error("Error during rollback process for client {}: {}", progress.getClientId(), e.getMessage(), e);
		}
	}

	private Tenant createTenantInMasterSchema(TenantRequest tenantRequest) {
		Tenant tenant = new Tenant();
		tenant.setClientId(tenantRequest.getClientId());
		tenant.setTitle(tenantRequest.getTitle());
		tenant.setSchemaName(tenantRequest.getClientId());
		tenant.setStatus("ACTIVE");
		String url = "https://" + tenantRequest.getClientId() + "." + domain;
		tenant.setClientUrl(url);
		return tenantRepository.save(tenant);
	}

	private ClinicMaster createClinicInMasterSchema(TenantRequest tenantRequest, Tenant savedTenant) {
		ClinicMaster clinicMaster = new ClinicMaster();
		clinicMaster.setName(tenantRequest.getName());
		clinicMaster.setEmail(tenantRequest.getEmail());
		clinicMaster.setContact(tenantRequest.getContact());
		clinicMaster.setAddress(tenantRequest.getAddress());
		if(tenantRequest.getClinicType()!=null){
			clinicMaster.setClinicType(tenantRequest.getClinicType());
		}
		clinicMaster.setExistSoftware(tenantRequest.getExistSoftware());
		clinicMaster.setConsentToContact(tenantRequest.isConsentToContact());
		clinicMaster.setAcceptTerms(tenantRequest.isAcceptTerms());
		clinicMaster.setTenant(savedTenant);
		return clinicMasterRepository.save(clinicMaster);
	}

	private boolean createDns(String clientId) {
		try {
			Dns dns = new Dns();
			dns.setName(clientId + "." + domain);
			dns.setContent(domain);
			dns.setProxied(true);
			dns.setType("CNAME");
			dns.setComment(clientId + " Domain verification record added by API.");
			dns.setTtl(1);

			HttpEntity<Dns> request = new HttpEntity<>(dns);

			HttpHeaders headers = new HttpHeaders();
			headers.add("Authorization", "Bearer " + token);

			String cfUrlCreateDns = "/zones/" + zoneId + "/dns_records/";
			DnsResponse response = restTemplate.postForObject(cfUrlCreateDns, request, DnsResponse.class, headers);

			if (response != null && response.isSuccess()) {
				log.info("Cloudflare DNS creation success: {}", response.getResult());
				return true;
			} else if (response != null) {
				log.error("Cloudflare DNS creation failed. Errors: {}", response.getErrors());
			} else {
				log.error("Cloudflare DNS creation failed: response is null");
			}
		} catch (Exception e) {
			log.error("DNS creation error.", e);
		}
		return false;
	}

	public boolean doesDnsRecordExist(String subdomain) {
		try {
			String url = String.format("/zones/%s/dns_records?name=%s.%s", zoneId, subdomain, domain);
			// Cloudflare returns a list of DNS records in the "result" field
			DnsResponse response = restTemplate.getForObject(url, DnsResponse.class);
			if (response != null && response.isSuccess() && response.getResult() != null) {
				// If result is not empty, record exists
				return true;
			}
		} catch (Exception e) {
			log.error("Error checking DNS record existence for {}.{}: {}", subdomain, domain, e.getMessage());
		}
		return false;
	}

	@Override
	public WebInfo upload(MultipartFile logoFile, MultipartFile favFile, MultipartFile bannerFile) {
		WebInfo wi = new WebInfo();
		String tenantId = TenantContextHolder.getCurrentTenant();
		Tenant tenant = findByTenantId(tenantId);
		boolean isUpdated = false;

		if (logoFile != null) {
			String logo = fileService.upload(logoFile, true, tenantId);
			tenant.setLogo(logo);
			isUpdated = true;
		}

		if (favFile != null) {
			String favIcon = fileService.upload(favFile, true, tenantId);
			tenant.setFavIcon(favIcon);
			isUpdated = true;
		}

		if (bannerFile != null) {
			String banner = fileService.upload(bannerFile, true, tenantId);
			tenant.setBannerHome(banner);
			isUpdated = true;
		}

		if (isUpdated)
			tenantRepository.save(tenant);

		wi.setName(tenant.getClientId());
		wi.setUrl(tenant.getClientUrl());
		wi.setTitle(tenant.getTitle());
		wi.setFavIcon(tenant.getFavIcon());
		wi.setLogo(tenant.getLogo());
		wi.setBannerHome(tenant.getBannerHome());

		return wi;
	}

	@Override
	public Status isExistsByTenantId(String clientId) {
		try {
			if (clientId == null || clientId.isEmpty()) {
				return new Status(true, "Subdomain is required.");
			}
			if (subdomainValidator.isInvalidSubdomain(clientId)) {
				return new Status(true,
						"Subdomain can only contain lowercase letters, numbers, hyphens, and no reserved keywords.");
			}
			if (tenantRepository.existsByClientId(clientId)) {
				return new Status(true, "This subdomain is already taken. Please choose another.");
			}
			/*
			 if (doesDnsRecordExist(clientId)) {
				 return new Status(true, "This subdomain is already taken. Please choose another.");
			}
			*/
			
			return new Status(false, "This subdomain is available!");
		} catch (Exception e) {
			return new Status(true, "An unexpected error occurred. Please try again later.");
		}
	}

	@Override
	public List<TenantRequestProj> getAllTenantRequests() {
		return tenantRequestRepository.findAllTenantRequest();
	}

	@Override
	public Page<TenantProj> filterAllTenant(Pageable pageable, TenantFilter filter) {
		String searchKey = filter.getSearchKey() != null ? filter.getSearchKey() : "";
		return tenantRepository.searchTenants(pageable, searchKey);
	}
}
