package com.jee.clinichub.app.patient.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.antlr.v4.runtime.atn.SemanticContext.OR;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.doctor.model.Doctor;
import com.jee.clinichub.app.patient.model.Patient;
import com.jee.clinichub.app.patient.model.PatientDto;
import com.jee.clinichub.app.patient.model.PatientOptProj;
import com.jee.clinichub.app.patient.model.PatientProj;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

	Patient findPatientByFirstname(String name);

	List<PatientProj> findAllProjectedBy();

	@Cacheable(value = "patientListCache", keyGenerator = "multiTenantCacheKeyGenerator")
	List<PatientProj> findAllProjectedByUser_Branch_idOrderByIdDesc(Long branchId);

	@Cacheable(value = "patientListCache", keyGenerator = "multiTenantCacheKeyGenerator")
	List<PatientOptProj> findAllProjectedByFirstnameIgnoreCaseContainingOrderByFirstnameAsc(String name);

	@Cacheable(value = "patientListCache", keyGenerator = "multiTenantCacheKeyGenerator")
	List<PatientOptProj> findAllProjectedByFirstnameIgnoreCaseContainingOrUser_phoneOrderByFirstnameAsc(String name,
			String phone);

	// Page<Patient> findAllByUser_Branch_idOrderByIdDesc(PageRequest pr);

	// Page<PatientProj> findAllProjectedByUser_Branch_idOrderByIdDesc(Long id,
	// PageRequest pr);

	Page<PatientProj> findPagedProjectedBy(Pageable pr);

	@Cacheable(value = "patientListCache", keyGenerator = "multiTenantCacheKeyGenerator")
	Page<PatientProj> findPagedProjectedByBranch_idOrderByIdDesc(Long id, Pageable pr);

	@Cacheable(value = "patientListCache", keyGenerator = "multiTenantCacheKeyGenerator")
	Page<PatientProj> findPagedProjectedByBranch_idAndFirstnameIgnoreCaseContainingOrderByIdDesc(Long id,
			Pageable pr, String search);

	@Cacheable(value = "patientListCache", keyGenerator = "multiTenantCacheKeyGenerator")
	Page<PatientProj> findPagedProjectedByBranch_idAndFirstnameIgnoreCaseContainingOrLastnameIgnoreCaseContainingOrderByIdDesc(
			Long id, Pageable pr, String firstname, String lastname);

	@Query("SELECT p FROM Patient p " +
			"WHERE p.branch.id = :branchId " +
			"AND (:genders IS NULL OR p.gender IN :genders) " +
			"AND ((:value IS NULL OR LOWER(p.firstname) LIKE LOWER(CONCAT('%', :value, '%'))) " +
			"OR (:value IS NULL OR LOWER(p.lastname) LIKE LOWER(CONCAT('%', :value, '%'))) " +
			"OR (:value IS NULL OR LOWER(p.user.phone) LIKE LOWER(CONCAT('%', :value, '%'))) )" +
			"ORDER BY p.id DESC")
	Page<PatientProj> search(Pageable pr,
			@Param("branchId") Long branchId,
			@Param("value") String value,
			List<String> genders);

	boolean existsByUser_phone(String phone);

	
	Patient findByUser_username(String name);
	
	@Query("SELECT p FROM Patient p JOIN FETCH p.branch WHERE p.user.username = :username")
	Optional<Patient> findWithBranchByUser_username(@Param("username") String username);
	

@Query("SELECT p FROM Patient p JOIN FETCH p.branch " +
       "WHERE (:genders IS NULL OR p.gender IN :genders) " +
       "AND (" +
           "(:value IS NULL OR LOWER(p.firstname) LIKE LOWER(CONCAT('%', :value, '%'))) " +
           "OR (:value IS NULL OR LOWER(p.lastname) LIKE LOWER(CONCAT('%', :value, '%'))) " +
           "OR (:value IS NULL  OR LOWER(p.whatsappNo) LIKE LOWER(CONCAT('%', :value, '%'))) " +
       ") " +
       "ORDER BY p.id DESC")
	Page<PatientProj> adminFilter(Pageable pr, String value, List<String> genders);

	Optional<Patient> findByGlobalPatientId(UUID globalPatientId);

    List<Patient> findAllByUser_PhoneContainingIgnoreCase(String phone);

	// "AND (:gender IS NULL OR (p.gender IN :gender)) " +
}