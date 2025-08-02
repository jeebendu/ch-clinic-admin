package com.jee.clinichub.app.appointment.labtest.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.appointment.labtest.model.LabTest;

@Repository
public interface LabTestRepository extends JpaRepository<LabTest, Long> {

    boolean existsByNameAndIdNot(String name, long l);

    List<LabTest> findAllByOrderByNameAsc();



    @Query("SELECT l FROM LabTest l WHERE (:name IS NULL OR LOWER(l.name) LIKE CONCAT('%', :name, '%'))")
    List<LabTest> filterByName(String name);
	


	
}