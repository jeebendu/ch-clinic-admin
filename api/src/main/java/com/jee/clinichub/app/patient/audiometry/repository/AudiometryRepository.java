package com.jee.clinichub.app.patient.audiometry.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.patient.audiometry.model.Audiometry;

@Repository
public interface AudiometryRepository extends JpaRepository<Audiometry, Long> {

	List<Audiometry> findAllByPatient_id(Long patientId);

	List<Audiometry> findAllByOrderByIdDesc();
	
}