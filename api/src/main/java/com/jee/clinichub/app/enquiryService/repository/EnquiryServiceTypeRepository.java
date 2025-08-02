package com.jee.clinichub.app.enquiryService.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.enquiryService.model.EnquiryServiceType;



@Repository
public interface EnquiryServiceTypeRepository extends JpaRepository<EnquiryServiceType,Long>{
	

}
