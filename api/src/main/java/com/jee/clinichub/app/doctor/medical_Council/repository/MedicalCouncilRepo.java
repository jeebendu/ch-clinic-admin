package com.jee.clinichub.app.doctor.medical_Council.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.jee.clinichub.app.doctor.medical_Council.model.MedicalCouncil;

@Repository
public interface MedicalCouncilRepo extends JpaRepository<MedicalCouncil, Long> {

    boolean existsByNameIgnoreCaseAndIdNot(String name, long l);

    List<MedicalCouncil> findAllByNameContainingIgnoreCase(String name);
  
    
}
