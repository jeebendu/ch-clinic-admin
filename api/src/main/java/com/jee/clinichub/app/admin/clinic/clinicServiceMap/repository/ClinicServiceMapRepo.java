package com.jee.clinichub.app.admin.clinic.clinicServiceMap.repository;

import java.util.Collection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.admin.clinic.clinicServiceMap.model.ClinicServiceMap;



@Repository
public interface ClinicServiceMapRepo extends JpaRepository<ClinicServiceMap , Long> {

  
    

  
    boolean existsByBranch_clinic_idAndBranch_idAndEnquiryService_idAndIdNot(Long id, Long id2, Long id3, long l);

    Collection<ClinicServiceMap> findAllByBranch_id(Long id);

    
}
