package com.jee.clinichub.app.doctor.medical_university.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.doctor.medical_university.model.MedicalUniversity;

@Repository
public interface MedicalUniversityRepo extends JpaRepository<MedicalUniversity, Long> {

    boolean existsByNameIgnoreCaseAndIdNot(String name, long l);

    List<MedicalUniversity> findAllByNameContainingIgnoreCase(String name);
  
    
}
