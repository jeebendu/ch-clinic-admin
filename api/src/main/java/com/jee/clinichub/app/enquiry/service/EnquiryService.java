package com.jee.clinichub.app.enquiry.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.app.core.DataImport;
import com.jee.clinichub.app.core.status.model.StatusDTO;
import com.jee.clinichub.app.enquiry.model.Enquiry;
import com.jee.clinichub.app.enquiry.model.EnquiryDto;
import com.jee.clinichub.app.enquiry.model.EnquiryFilter;
import com.jee.clinichub.app.enquiry.model.EnquiryProj;
import com.jee.clinichub.global.model.SearchObj;
import com.jee.clinichub.global.model.Status;

public interface EnquiryService {
	
	//Enquiry findByName(String name);

	EnquiryDto getById(Long id);

	Status deleteById(Long id);

	Status saveOrUpdate(EnquiryDto Branch);

	List<EnquiryDto> getAllEnquirys();

	Enquiry getEnquiryById(Long id);

	Page<EnquiryProj> getEnquiriesPage(int page, int size, SearchObj search);

    Status importData(MultipartFile file, DataImport dataImport);

	List<StatusDTO> getDashboardCount();

	Page<EnquiryProj> getPatientespageBySid(int page, int size, Long sid);


   
}
