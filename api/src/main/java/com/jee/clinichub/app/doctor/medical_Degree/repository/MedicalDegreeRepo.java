package com.jee.clinichub.app.doctor.medical_Degree.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.jee.clinichub.app.doctor.medical_Degree.model.MedicalDegree;

@Repository
public interface MedicalDegreeRepo extends JpaRepository<MedicalDegree, Long> {

    boolean existsByNameIgnoreCaseAndIdNot(String name, long l);

    List<MedicalDegree> findAllByNameContainingIgnoreCase(String name);
  
    
}
