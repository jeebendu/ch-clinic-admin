package com.jee.clinichub.app.followedUp_dateList.service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.enquiry.model.Enquiry;
import com.jee.clinichub.app.enquiry.repository.EnquiryRepository;
import com.jee.clinichub.app.followedUp_dateList.model.FollowedUpDateList;
import com.jee.clinichub.app.followedUp_dateList.model.FollowedUpDateListDto;
import com.jee.clinichub.app.followedUp_dateList.repository.FollowedUpDateListRepository;
import com.jee.clinichub.app.staff.model.Staff;
import com.jee.clinichub.app.staff.repository.StaffRepository;
import com.jee.clinichub.app.user.service.UserService;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service(value = "followedUpDateListService")
public class FollowedUpDateListServiceImpl implements FollowedUpDateListService {

	private static final Logger log = LoggerFactory.getLogger(FollowedUpDateListServiceImpl.class);

	@Autowired
	private FollowedUpDateListRepository followedUpDateListRepository;

	@Autowired
	private EnquiryRepository enquiryRepository;

	@Autowired
	private StaffRepository staffRepository;

	@Autowired
	private UserService userService;

	@Override
	public List<FollowedUpDateListDto> getAllList() {
		List<FollowedUpDateList> followedUpDateList = followedUpDateListRepository.findAll();
		List<FollowedUpDateListDto> followedUpDateDtoList = followedUpDateList.stream().map(FollowedUpDateListDto::new)
				.collect(Collectors.toList());
		return followedUpDateDtoList;
	}

	@Override
	public FollowedUpDateListDto getById(Long id) {
		FollowedUpDateListDto followedUpDateListDto = new FollowedUpDateListDto();
		try {
			Optional<FollowedUpDateList> followedUpDateList = followedUpDateListRepository.findById(id);
			if (followedUpDateList.isPresent()) {
				followedUpDateListDto = new FollowedUpDateListDto(followedUpDateList.get());
			}
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return followedUpDateListDto;
	}

	@Override
	public List<FollowedUpDateListDto> getByEnquiryId(Long enquiryId) {
		List<FollowedUpDateList> followedUpDateList = followedUpDateListRepository
				.findByEnquiry_idOrderByFollowUpDateDesc(enquiryId);
		List<FollowedUpDateListDto> followedUpDateDtoList = followedUpDateList.stream().map(FollowedUpDateListDto::new)
				.collect(Collectors.toList());
		return followedUpDateDtoList;
	}

	@Override
	public Status saveOrUpdate(@Valid FollowedUpDateListDto followedUpDateListDto) {
		try {
			FollowedUpDateList followedUpDateList = new FollowedUpDateList();

			if (followedUpDateListDto.getId() == null) {

				Staff currentStaff = userService.getCurrentStaff();

				followedUpDateList = new FollowedUpDateList(followedUpDateListDto);
				followedUpDateList.setFollowUpBy(new Staff(followedUpDateListDto.getEnquiry().getStaff()));
				followedUpDateList.setFollowUpBy(currentStaff);
			} else {
				followedUpDateList = this.update(followedUpDateListDto);
			}

			Enquiry enquiry = enquiryRepository.findById(followedUpDateListDto.getEnquiry().getId()).get();
			followedUpDateList.setEnquiry(enquiry);

			followedUpDateList = followedUpDateListRepository.save(followedUpDateList);
			return new Status(true, ((followedUpDateListDto.getId() == null) ? "Added" : "Updated") + " Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");

	}

	private FollowedUpDateList update(@Valid FollowedUpDateListDto followedUpDateListDto) {
		FollowedUpDateList followedUpDateList = new FollowedUpDateList();
		try {
			Optional<FollowedUpDateList> _followedUpDateList = followedUpDateListRepository
					.findById(followedUpDateListDto.getId());
			if (_followedUpDateList.isPresent()) {
				followedUpDateList = _followedUpDateList.get();
				followedUpDateList.setFollowUpDate(followedUpDateListDto.getFollowUpDate());
				followedUpDateList.setRemark(followedUpDateListDto.getRemark());
				followedUpDateList.setNextFollowUpDate(followedUpDateListDto.getNextFollowUpDate());

			}
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return followedUpDateList;
	}

	@Override
	public Status deleteById(Long id) {
		try {
			Optional<FollowedUpDateList> fllowedUpDateList = followedUpDateListRepository.findById(id);
			if (!fllowedUpDateList.isPresent()) {
				return new Status(false, "Not Found");
			}

			followedUpDateListRepository.deleteById(id);
			return new Status(true, "Deleted Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");

	}

	@Override
	public FollowedUpDateListDto getLatestByEId(Long eid) {
		FollowedUpDateListDto followedUpDateListDto = new FollowedUpDateListDto();
		try {

			FollowedUpDateList followedUpDateList = followedUpDateListRepository
					.findByEnquiry_idOrderByCreatedTime(eid);
			followedUpDateListDto = new FollowedUpDateListDto(followedUpDateList);

		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}

		return followedUpDateListDto;
	}

	@Override
	public List<FollowedUpDateListDto> getAllListByStaffIdAndToday() {
		Staff currentStaff = userService.getCurrentStaff();
		Long staffId = currentStaff.getId();
		log.info("Staff Id: " + staffId);

		// Get start of today
		Calendar calendarStart = Calendar.getInstance();
		calendarStart.set(Calendar.HOUR_OF_DAY, 0);
		calendarStart.set(Calendar.MINUTE, 0);
		calendarStart.set(Calendar.SECOND, 0);
		calendarStart.set(Calendar.MILLISECOND, 0);
		Date startOfDay = calendarStart.getTime();

		// Get end of today
		Calendar calendarEnd = (Calendar) calendarStart.clone();
		calendarEnd.add(Calendar.DAY_OF_MONTH, 1);
		calendarEnd.add(Calendar.MILLISECOND, -1);
		Date endOfDay = calendarEnd.getTime();

		log.info("Start of Today: " + startOfDay);
		log.info("End of Today: " + endOfDay);

		// List<FollowedUpDateList> followedUpDateList =
		// followedUpDateListRepository.findByFollowUpBy_idAndNextFollowUpDateBetween(staffId,startOfDay,endOfDay);
		List<FollowedUpDateList> followedUpDateList = followedUpDateListRepository
				.findByFollowUpBy_idAndNextFollowUpDateGreaterThanEqual(staffId, startOfDay);

		List<FollowedUpDateListDto> followedUpDateDtoList = followedUpDateList.stream().map(FollowedUpDateListDto::new)
				.collect(Collectors.toList());
		return followedUpDateDtoList;
	}

}
