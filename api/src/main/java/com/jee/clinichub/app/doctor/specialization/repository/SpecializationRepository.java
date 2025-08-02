package com.jee.clinichub.app.doctor.specialization.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.doctor.specialization.model.Specialization;

@Repository
public interface SpecializationRepository  extends JpaRepository<Specialization,Long>{

    boolean existsByNameAndIdNot(String name, Long id);

    boolean existsByName(String name);

    Specialization findByName(String name);

    List<Specialization> findAllByNameContainingIgnoreCase(String name);

	List<Specialization> findAllByOrderBySortOrderAsc();

    // countDoctorBySpecializationId(Long id);


  
   
}
