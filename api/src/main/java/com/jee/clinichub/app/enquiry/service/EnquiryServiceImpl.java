package com.jee.clinichub.app.enquiry.service;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.app.branch.context.BranchContextHolder;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.branch.repository.BranchRepository;
import com.jee.clinichub.app.core.DataImport;
import com.jee.clinichub.app.core.country.model.Country;
import com.jee.clinichub.app.core.country.repository.CountryRepository;
import com.jee.clinichub.app.core.district.model.District;
import com.jee.clinichub.app.core.district.repository.DistrictRepository;
import com.jee.clinichub.app.core.source.model.Source;
import com.jee.clinichub.app.core.source.repository.SourceRepo;
import com.jee.clinichub.app.core.state.model.State;
import com.jee.clinichub.app.core.state.repository.StateRepository;
import com.jee.clinichub.app.core.status.model.StatusDTO;
import com.jee.clinichub.app.core.status.model.StatusModel;
import com.jee.clinichub.app.core.status.repository.StatusRepo;
import com.jee.clinichub.app.enquiry.model.Enquiry;
import com.jee.clinichub.app.enquiry.model.EnquiryDto;
import com.jee.clinichub.app.enquiry.model.EnquiryFilter;
import com.jee.clinichub.app.enquiry.model.EnquiryProj;
import com.jee.clinichub.app.enquiry.repository.EnquiryRepository;
import com.jee.clinichub.app.enquiryService.model.EnquiryServiceType;
import com.jee.clinichub.app.enquiryService.repository.EnquiryServiceTypeRepository;
import com.jee.clinichub.app.enquiryService.service.EnquiryServiceTypeSv;
import com.jee.clinichub.app.followedUp_dateList.model.FollowedUpDateList;
import com.jee.clinichub.app.followedUp_dateList.repository.FollowedUpDateListRepository;
import com.jee.clinichub.app.relationship.model.Relationship;
import com.jee.clinichub.app.relationship.repository.RelationshipRepository;
import com.jee.clinichub.app.staff.model.Staff;
import com.jee.clinichub.app.staff.repository.StaffRepository;
import com.jee.clinichub.app.user.service.UserService;
import com.jee.clinichub.global.model.SearchObj;
import com.jee.clinichub.global.model.Status;
import com.jee.clinichub.global.utility.DateUtility;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service(value = "enquiryService")
public class EnquiryServiceImpl implements EnquiryService {

	
	@Autowired
	private EnquiryServiceTypeRepository enquiryServiceTypeRepository;

	@Autowired
	private EnquiryRepository enquiryRepository;

	@Autowired
	private FollowedUpDateListRepository followedUpDateListRepository;
	
	@Autowired private UserService userService;

	@Autowired SourceRepo sourceRepo;

	@Autowired StatusRepo statusRepo;
	
	@Autowired CountryRepository countryRepository;

	@Autowired StateRepository stateRepository;

	@Autowired RelationshipRepository relationshipRepository;

	@Autowired DistrictRepository districtRepository;

	@Autowired
	private BranchRepository branchRepository;
	
	@Autowired
	StaffRepository staffRepository;

	@Override
	public Status saveOrUpdate(EnquiryDto enquiryDto) {
		try {

			//boolean isExistName = (enquiryDto.getId()==null) ?
			// enquiryRepository.existsByName(enquiryDto.getName()):
			// enquiryRepository.existsByNameAndIdNot(enquiryDto.getName(),enquiryDto.getId());
			// boolean isExistCode = (enquiryDto.getId()==null) ?
			// enquiryRepository.existsByCode(enquiryDto.getCode()):
			// enquiryRepository.existsByCodeAndIdNot(enquiryDto.getCode(),enquiryDto.getId());

			// if(isExistName){return new Status(false,"Enquiry Name already exist");
			// }
			// else if(isExistCode){return new Status(false,"Enquiry Code already exist");}

			Enquiry enquiry = new Enquiry();
			FollowedUpDateList followUp = new FollowedUpDateList();

			if (enquiryDto.getId() == null) {
				
				Branch currentBranch = branchRepository.findById(BranchContextHolder.getCurrentBranch().getId())
                  .orElseThrow(() -> new RuntimeException("Branch not found"));
				enquiry = new Enquiry(enquiryDto);
				enquiry.setBranch(currentBranch);
				
				
				followUp.setEnquiry(enquiry);
				followUp.setFollowUpDate(enquiryDto.getLeadDate());
				followUp.setNextFollowUpDate(enquiryDto.getNextFollowedUpDate());
				followUp.setRemark(enquiryDto.getRemark());
				followUp.setFollowUpBy(new Staff(enquiryDto.getStaff()));
				followedUpDateListRepository.save(followUp);

			} else {
				enquiry = this.updateEnquiry(enquiryDto);
			}

			enquiry = enquiryRepository.save(enquiry);

			return new Status(true, ((enquiryDto.getId() == null) ? "Added" : "Updated") + " Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");

	}

	private Enquiry updateEnquiry(EnquiryDto enquiryDto) {
    	Enquiry exEnquiry = enquiryRepository.findById(enquiryDto.getId()).get();
    	exEnquiry.setFirstName(enquiryDto.getFirstName());
		exEnquiry.setLastName(enquiryDto.getLastName());
		exEnquiry.setMobile(enquiryDto.getMobile());
		exEnquiry.setEnquiryServiceType(new EnquiryServiceType(enquiryDto.getEnquiryServiceType()));
		exEnquiry.setRelationship(new Relationship(enquiryDto.getRelationship()));
		exEnquiry.setLeadDate(enquiryDto.getLeadDate());
		exEnquiry.setFollowUpBy(enquiryDto.getFollowUpBy());
		exEnquiry.setStatus(new StatusModel(enquiryDto.getStatus()));
		exEnquiry.setCountry(new Country(enquiryDto.getCountry()));
		exEnquiry.setCity(enquiryDto.getCity());
		exEnquiry.setState(new State(enquiryDto.getState()));
		exEnquiry.setCountryCode(enquiryDto.getCountryCode());
		exEnquiry.setRemark(enquiryDto.getRemark());
		exEnquiry.setSource(new Source(enquiryDto.getSource()));
		exEnquiry.setNeeds(enquiryDto.getNeeds());
		exEnquiry.setNotes(enquiryDto.getNotes());
		exEnquiry.setStaff(new Staff(enquiryDto.getStaff()));
		exEnquiry.setDistrict(new District(enquiryDto.getDistrict()));

		return exEnquiry;

	}

	@Override
	public List<EnquiryDto> getAllEnquirys() {
		List<Enquiry> enquiryList = enquiryRepository.findAll();
		List<EnquiryDto> enquiryDtoList = enquiryList.stream().map(EnquiryDto::new).collect(Collectors.toList());
		return enquiryDtoList;
	}

	@Override
	@Cacheable(value = "enquiryCache", keyGenerator = "multiTenantCacheKeyGenerator")
	public EnquiryDto getById(Long id) {
		EnquiryDto enquiryDto = new EnquiryDto();
		try {
			Optional<Enquiry> enquiry = enquiryRepository.findById(id);
			if (enquiry.isPresent()) {
				enquiryDto = new EnquiryDto(enquiry.get());
			}
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return enquiryDto;
	}

	@Override
	@Cacheable(value = "enquiryCache", keyGenerator = "multiTenantCacheKeyGenerator")
	public Enquiry getEnquiryById(Long id) {
		Enquiry enquiry = new Enquiry();
		try {
			Optional<Enquiry> _enquiry = enquiryRepository.findById(id);
			if (_enquiry.isPresent()) {
				enquiry = _enquiry.get();
			}
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return enquiry;
	}

	@Override
	public Status deleteById(Long id) {
		try {
			Optional<Enquiry> enquiry = enquiryRepository.findById(id);
			if (!enquiry.isPresent()) {
				return new Status(false, "Enquiry Not Found");
			}

			enquiryRepository.deleteById(id);
			return new Status(true, "Deleted Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");
	}

	@Override
	public Page<EnquiryProj> getEnquiriesPage(int page, int size, SearchObj search) {
		Branch branch = BranchContextHolder.getCurrentBranch();
		Pageable pr = PageRequest.of(page, size);
		// if (search.allFieldsAreNull()) {
		// 	return enquiryRepository.findPagedProjectedByBranch_idOrderByIdDesc(branch.getId(), pr);
		// } else {
			return enquiryRepository.findPagedEnquiriesByFilters(
				pr,
				branch.getId(),
				search.getStaffId()!=null ? search.getStaffId() : null,
				search.getTypeId()!= null ? search.getTypeId() : null,
				search.getStatusId()!= null ? search.getStatusId() : null,
				search.getSearchKey()!= null ? search.getSearchKey() : "",
				search.getSearchKey()!= null ? search.getSearchKey() : "",
				search.getSearchKey()!= null ? search.getSearchKey() : "",
				search.getSearchKey()!= null ? search.getSearchKey() : ""
			);
		// }
	}
	

	@Override
	@CacheEvict(value = "enquiryListCache", allEntries = true, keyGenerator = "multiTenantCacheKeyGenerator")
	public Status importData(MultipartFile file, DataImport dataImport) {
		try (InputStream inputStream = file.getInputStream();
			 BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
			 CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT)) {

			List<Enquiry> enquiryList = new ArrayList<>();
			Iterable<CSVRecord> csvRecords = csvParser.getRecords();

			List<EnquiryServiceType> enquiryServiceTypeList = enquiryServiceTypeRepository.findAll();
			List<Source> sourceList = sourceRepo.findAll();
			List<StatusModel> statusList = statusRepo.findAll();
			List<Country> countryList = countryRepository.findAll();
			List<State> stateList = stateRepository.findAll();
			List<Relationship> relationList = relationshipRepository.findAll();
			List<District> districtList = districtRepository.findAll();
			List<Staff> staffList = staffRepository.findAll();
			Branch branch = BranchContextHolder.getCurrentBranch();

			int skipRows = 3;
			int n = 4;
			for (CSVRecord row : csvRecords) {
				if (skipRows > 0) {
					skipRows--;
					continue;
				}

				if ( !row.get(0).equals("")) {
					StringBuilder logMessage = new StringBuilder();
					String targetName = row.get(18);
					Optional<EnquiryServiceType> filteredObject = enquiryServiceTypeList.stream()
							.filter(i -> targetName.equals(i.getName())).findFirst();
					EnquiryServiceType enquiryServiceType = filteredObject.orElseGet(() ->
							enquiryServiceTypeList.stream().filter(i -> "Other".equals(i.getName())).findFirst().get());

					String sourceName = row.get(13);
					Optional<Source> filteredSource = sourceList.stream()
							.filter(i -> sourceName.equals(i.getName())).findFirst();
					Source source = filteredSource.orElseGet(() ->
							sourceList.stream().filter(i -> "Other".equals(i.getName())).findFirst().get());

					String statusName = row.get(10);
					Optional<StatusModel> filteredStatus = statusList.stream()
							.filter(i -> statusName.equals(i.getName())).findFirst();
					StatusModel statusModel = filteredStatus.orElseGet(() ->
							statusList.stream().filter(i -> "FOLLOW UP".equals(i.getName())).findFirst().get());

					String relationName = "Self";
					Optional<Relationship> filteredRelation = relationList.stream()
							.filter(i -> relationName.equals(i.getName())).findFirst();
					Relationship relation = filteredRelation.orElseGet(() ->
							relationList.stream().filter(i -> "Other".equals(i.getName())).findFirst().get());

				
					String districtName = row.get(6);
					Optional<District> filteredDistrict = districtList.stream()
							.filter(i -> districtName.equalsIgnoreCase(i.getName())).findFirst();
					District district = filteredDistrict.orElse(null);
					
					
					String stateName = row.get(7);
					Optional<State> filteredState = stateList.stream()
							.filter(i -> stateName.equalsIgnoreCase(i.getName())).findFirst();
					State state = filteredState.orElseGet(() ->
					stateList.stream().filter(i -> "Odisha".equalsIgnoreCase(i.getName())).findFirst().get());

					
					String countryName = row.get(8);
					Optional<Country> filteredCountry = countryList.stream()
							.filter(i -> countryName.equalsIgnoreCase(i.getName())).findFirst();
					Country country = filteredCountry.orElseGet(() ->
							countryList.stream().filter(i -> "India".equalsIgnoreCase(i.getName())).findFirst().get());

					
					String name = row.get(2).replace("Mr. ", "").replace("Ms. ", "");
					String[] nameArray = name.split(" ");

					String firstName = "";
					String lastName = "";
					
					if (nameArray.length > 1) {
						lastName = nameArray[nameArray.length - 1]; // Assigns the last element of nameArray to lastName
					}
					if (nameArray.length > 0) {
						firstName = name.replace(lastName,"");
					}
					
					logMessage.append(n).append(" - ").append(row.get(2)).append(" converted ").append(firstName)
							.append(" => ").append(lastName);
					
					Branch currentBranch = branchRepository.findById(BranchContextHolder.getCurrentBranch().getId())
			                  .orElseThrow(() -> new RuntimeException("Branch not found"));
					
					String[] staffName = row.get(3).split(" ");
					Staff staff = staffList.stream().filter(i -> i.getFirstname().equalsIgnoreCase(staffName[0]))
											.findFirst()
											.orElse(staffList.get(0));
					//log.info(staff.getFirstname());

					Enquiry enquiry = Enquiry.builder()
							.firstName(firstName)
							.lastName(lastName)
							.countryCode("91")
							.mobile(row.get(4))
							.enquiryServiceType(enquiryServiceType)
							.city(row.get(6))
							.leadDate(DateUtility.stringToDate(row.get(14), "dd-MMM-yy"))
							.followUpBy(row.get(3))
							.relationship(relation)
							.status(statusModel)
							.country(country)
							.state(state)
							.source(source)
							.needs(row.get(17))
							.notes(row.get(19))
							.staff(staff)
							.district(district)
							.branch(currentBranch)
							.build();

					List<FollowedUpDateList> followUpList = new ArrayList<>();

					String lastTalk = row.get(15);
					if (!lastTalk.equalsIgnoreCase("-")) {
						String[] lastTalkArray = lastTalk.split(" - ");
						String lastTalkDate = lastTalkArray[0];
						String followBy = lastTalkArray[1];
						String lastTalkRemark = lastTalkArray[2];

						followUpList.add(FollowedUpDateList.builder()
								.enquiry(enquiry)
								.followUpDate(DateUtility.stringToDate(lastTalkDate, "dd-MMM-yy"))
								.remark(lastTalkRemark)
								.followUpBy(staff!=null?staff:staffList.get(0))
								.build());
					}

					String nextAction = row.get(16);
					if (!nextAction.equalsIgnoreCase("-")) {
						String[] nextActionArray = nextAction.split(" - ");
						
						String nextActionDate = "";
						if (nextActionArray.length > 0) {
							nextActionDate = nextActionArray[0];
						}
						
						String nextActionRemark ="" ;
						if (nextActionArray.length > 1) {
							nextActionRemark = nextActionArray[1];
						}
						

						followUpList.add(FollowedUpDateList.builder()
								.enquiry(enquiry)
								.followUpDate(DateUtility.stringToDate(nextActionDate, "dd-MMM-yy"))
								.followUpBy(staff)
								.remark(nextActionRemark)
								.build());
					}

					enquiry.setFollowUpList(followUpList);
					enquiryList.add(enquiry);

					//log.info(logMessage.toString());
				}
				n++;
			}
			log.info("Save process started");
			//Collections.reverse(enquiryList);
			enquiryRepository.saveAll(enquiryList);
			log.info("Save process completed");
			
			return new Status(true, "Enquiry Imported Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
			return new Status(false, "Something went wrong");
		}
	}

	@Override
	public List<StatusDTO> getDashboardCount() {
		
		Branch branch = BranchContextHolder.getCurrentBranch();
		Staff staff =userService.getCurrentStaff();
		
		List<StatusDTO> statusDTOs = new ArrayList<>();
		List<Object[]> counts;
		// Fetch counts grouped by service type in a single query
		if(staff != null && staff.getUser().getRole().getName().equalsIgnoreCase("Staff")) {
			 counts = enquiryRepository.countByStatusGroupedByBranchIdAndStaff_id(branch.getId(),staff.getId());
		}
		else {
		 counts = enquiryRepository.countByStatusGroupedByBranchId(branch.getId());
		}

		// Map the counts to the corresponding StatusDTO
		counts.forEach(result -> {
			StatusModel status = (StatusModel) result[0];
			Long count = (Long) result[1];
			statusDTOs.add(new StatusDTO(status.getId(),status.getName(),status.getColor(),status.getSortOrder(), count));
		});
		statusDTOs.sort((a,b) -> (int) (a.getSortOrder() - b.getSortOrder()));
		
		return statusDTOs;
	}

	@Override
	public Page<EnquiryProj> getPatientespageBySid(int page, int size, Long sid) {
		Branch branch = BranchContextHolder.getCurrentBranch();
		Pageable pr = PageRequest.of(page, size);
		return enquiryRepository.findPagedProjectedByBranch_idAndStaff_idOrderByIdDesc(branch.getId(),sid,pr);
		
	}


}
