package com.jee.clinichub.app.enquiryService.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.enquiryService.model.EnquiryServiceType;
import com.jee.clinichub.app.enquiryService.model.EnquiryServiceTypeDto;
import com.jee.clinichub.app.enquiryService.repository.EnquiryServiceTypeRepository;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service(value = "EnquiryServiceSv")
public class EnquiryServiceTypeSvImpl implements EnquiryServiceTypeSv {
	@Autowired
	private EnquiryServiceTypeRepository enquiryServiceTypeRepository;

	@Override
	public List<EnquiryServiceTypeDto> getAllenquiryService() {

		List<EnquiryServiceType> enquiryServiceTypeList = enquiryServiceTypeRepository.findAll();
		List<EnquiryServiceTypeDto> enquiryServiceTypeDtoList = enquiryServiceTypeList.stream()
				.map(EnquiryServiceTypeDto::new).toList();
		return enquiryServiceTypeDtoList;
	}

	@Override
	public EnquiryServiceTypeDto getById(Long id) {
		EnquiryServiceTypeDto enquiryServicTypeDto = new EnquiryServiceTypeDto();
		try {
			Optional<EnquiryServiceType> enquiryServiceType = enquiryServiceTypeRepository.findById(id);
			if (enquiryServiceType.isPresent()) {
				enquiryServicTypeDto = new EnquiryServiceTypeDto(enquiryServiceType.get());
			}
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());

		}
		return enquiryServicTypeDto;

	}

	@Override
	public Status saveOrUpdate(@Valid EnquiryServiceTypeDto enquiryServiceTypeDto) {
		try {
			EnquiryServiceType enquiryServiceType = new EnquiryServiceType();
			if (enquiryServiceTypeDto.getId() == null) {
				enquiryServiceType = new EnquiryServiceType(enquiryServiceTypeDto);

			} else {
				enquiryServiceType = this.setEnquiryServiceType(enquiryServiceTypeDto);
			}

			enquiryServiceTypeRepository.save(enquiryServiceType);
			return new Status(true, ((enquiryServiceTypeDto.getId() == null) ? "Added" : "Updated") + " Successfully");

		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");
	}

	private EnquiryServiceType setEnquiryServiceType(@Valid EnquiryServiceTypeDto enquiryServiceTypeDto) {
		EnquiryServiceType exEnquiryServiceType = new EnquiryServiceType();
		try {
			exEnquiryServiceType = enquiryServiceTypeRepository.findById(enquiryServiceTypeDto.getId()).get(); // for
																												// optional
																												// use
																												// get()
			exEnquiryServiceType.setName(enquiryServiceTypeDto.getName());
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());

		}
		return exEnquiryServiceType;
	}

	@Override
	public Status deleteById(Long id) {
		try {
			Optional<EnquiryServiceType> enquiryServiceType = enquiryServiceTypeRepository.findById(id);
			if (!enquiryServiceType.isPresent()) {
				return new Status(false, "Enquiry service not Found");
			}
			enquiryServiceTypeRepository.deleteById(id);
			return new Status(true, "Deleted Successfully");
		} catch (Exception e) {
			log.error(e.getLocalizedMessage());
		}
		return new Status(false, "Something went wrong");
	}
}