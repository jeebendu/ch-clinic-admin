package com.jee.clinichub.app.admin.clinic.clinicType.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jee.clinichub.app.admin.clinic.clinicType.model.ClinicType;

public interface ClinicTypeRepo extends JpaRepository<ClinicType , Long>{


	@Query("SELECT c FROM ClinicType c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))")
	List<ClinicType> filterType(@Param("name") String name);
    
}
