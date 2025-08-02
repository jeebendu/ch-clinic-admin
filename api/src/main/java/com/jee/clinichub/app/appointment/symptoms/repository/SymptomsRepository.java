package com.jee.clinichub.app.appointment.symptoms.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.appointment.symptoms.model.Symptoms;

@Repository
public interface SymptomsRepository extends JpaRepository<Symptoms, Long> {

    boolean existsByNameAndIdNot(String name, long l);

    List<Symptoms> findAllByOrderByNameAsc();



    @Query("SELECT s FROM Symptoms s WHERE (:name IS NULL OR LOWER(s.name) LIKE CONCAT('%', :name, '%'))")
    List<Symptoms> filterByName(String name);
	


	
}