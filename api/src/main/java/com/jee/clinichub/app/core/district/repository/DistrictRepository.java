package com.jee.clinichub.app.core.district.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jee.clinichub.app.core.district.model.District;
import com.jee.clinichub.app.core.district.model.DistrictDto;



public interface DistrictRepository extends JpaRepository<District,Long> {

    

    Optional<District> findByState_id(Integer id);

    boolean existsByNameIgnoreCase(String name);

    List<District> findAllByState_id(Integer id);

    List<District> findAllByNameContainingIgnoreCase(String name);
    
}
