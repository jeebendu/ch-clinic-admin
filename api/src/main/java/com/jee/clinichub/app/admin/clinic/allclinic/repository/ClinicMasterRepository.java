package com.jee.clinichub.app.admin.clinic.allclinic.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.jee.clinichub.app.admin.clinic.allclinic.model.Clinic;
import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicMaster;

public interface ClinicMasterRepository extends JpaRepository<ClinicMaster,Long>  {

	Optional<ClinicMaster> findByTenant_clientId(String srcTenant);


//@Query("SELECT c FROM ClinicMaster c WHERE (:name IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%')))")
//List<ClinicMaster> filterByname(String name);


// @Query("SELECT c FROM ClinicTenant c " +
// "WHERE  (:name IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%')))" +
// "AND (:email IS NULL OR LOWER(c.email) LIKE LOWER(CONCAT('%', :email, '%')))" +
// "AND (:address IS NULL OR c.address is NULL OR LOWER(c.address) LIKE LOWER(CONCAT('%', :address, '%')))")
// Page<ClinicProj> filterClinic(Pageable pageable,String name, String email, String address);


    
}
