
package com.jee.clinichub.app.doctor.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.checkerframework.checker.units.qual.s;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.doctor.model.Doctor;
import com.jee.clinichub.app.doctor.model.DoctorClinicMapProjection;
import com.jee.clinichub.app.doctor.model.DoctorDto;
import com.jee.clinichub.app.doctor.model.DoctorProj;
import com.jee.clinichub.app.doctor.model.DoctorStatus;
import com.jee.clinichub.app.doctor.model.DoctorWithOutBranchProj;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

	List<DoctorProj> findAllProjectedBy();

	@Cacheable(value = "doctorCache", keyGenerator = "multiTenantCacheKeyGenerator")
	@Query("SELECT DISTINCT d FROM Doctor d " +
			"JOIN d.branchList bl " +
			"WHERE (:branchId IS NULL OR bl.branch.id = :branchId)" +
			"ORDER BY d.id DESC")
	List<DoctorProj> findAlldoctorByBranch(Long branchId);

	@Cacheable(value = "doctorCache", keyGenerator = "multiTenantCacheKeyGenerator")
	Page<DoctorProj> findPagedProjectedByUser_Branch_idOrderByIdDesc(Long id, Pageable pr);

	@Cacheable(value = "doctorCache", keyGenerator = "multiTenantCacheKeyGenerator")
	Page<DoctorProj> findPagedProjectedByUser_Branch_idAndUser_NameIgnoreCaseContainingOrderByIdDesc(
			Pageable pr, Long branchId, String search);

	@Cacheable(value = "doctorCache", keyGenerator = "multiTenantCacheKeyGenerator")
	@Query("SELECT DISTINCT d FROM Doctor d " +
			"LEFT JOIN d.specializationList s " +
			"JOIN d.branchList bl " +
			"WHERE (:branchId IS NULL OR bl.branch.id = :branchId) " +
			"AND ((:value IS NULL OR LOWER(d.firstname) LIKE LOWER(CONCAT('%', :value, '%')) OR LOWER(d.lastname) LIKE LOWER(CONCAT('%', :value, '%'))) "
			+
			"OR (:value IS NULL OR LOWER(d.uid) LIKE LOWER(CONCAT('%', :value, '%'))) " +
			"OR (:value IS NULL OR LOWER(d.phone) LIKE LOWER(CONCAT('%', :value, '%')))) " +
			"AND (:external IS NULL OR d.external = :external) " +
			"AND (:specializationId IS NULL OR (s.id IS NULL) OR s.id = :specializationId) " +
			"ORDER BY d.id DESC")
	Page<DoctorProj> search(Pageable pr,
			@Param("branchId") Long branchId,
			@Param("value") String value,
			@Param("external") Boolean external,
			@Param("specializationId") Long specializationId);

	List<DoctorProj> findAllProjectedByOrderByUser_nameAsc();

	@Cacheable(value = "doctorCache", keyGenerator = "multiTenantCacheKeyGenerator")
	@Query("SELECT DISTINCT d FROM Doctor d " +
			"JOIN d.specializationList s " +
			"JOIN d.languageList l " +
			"WHERE (:specializationId IS NULL OR s.id = :specializationId)" +
			"AND (:gender IS NULL OR d.gender = :gender )" +
			"AND (:languageId IS NULL OR l.id = :languageId )" +
			"AND (:expYear IS NULL OR d.expYear >= :expYear )" +
			"ORDER BY d.id DESC")
	Page<DoctorProj> publicSearch(Pageable pageable,
			@Param("specializationId") Long specializationId,
			@Param("gender") Long gender,
			@Param("languageId") Long languageId,
			@Param("expYear") Float expYear);

	@Query("SELECT COUNT(d) FROM Doctor d " +
			"JOIN d.specializationList s WHERE s.id = :id")
	Long countDoctorBySpecializationId(Long id);

	Doctor findByPhoneOrEmail(String phone, String email);

	@Query("SELECT DISTINCT d FROM Doctor d " +
			"LEFT JOIN d.specializationList s " +
			"WHERE ((:value IS NULL OR LOWER(d.firstname) LIKE LOWER(CONCAT('%', :value, '%')) OR LOWER(d.lastname) LIKE LOWER(CONCAT('%', :value, '%'))) "
			+
			"OR (:value IS NULL OR LOWER(d.uid) LIKE LOWER(CONCAT('%', :value, '%'))) " +
			"OR (:value IS NULL OR LOWER(d.phone) LIKE LOWER(CONCAT('%', :value, '%')))) " +
			"AND (:external IS NULL OR d.external = :external) " +
			"AND (:status IS NULL OR d.status = :status) " +
			"AND (:specialization IS NULL OR (s.id IS NULL) OR s.id = :specialization) " +
			"ORDER BY d.id DESC")
	Page<DoctorWithOutBranchProj> adminSearch(
			Pageable pr,
			@Param("value") String value,
			@Param("status") DoctorStatus status,
			@Param("external") Boolean external,
			@Param("specialization") Long specialization);

	@Query("SELECT d FROM Doctor d " +
			"JOIN d.branchList bl " +
			"WHERE bl.branch.id = :branchId " +
			"AND d.verified = true " +
			"AND d.publishedOnline = true " +
			"AND d.deleted = false")
	List<Doctor> getDoctorsByBranchId(Long branchId);

	@Query(value = """
			SELECT * FROM doctor_branch_map_view
			WHERE (:searchText IS NULL OR :searchText = ''  OR search_vector @@ to_tsquery('simple', regexp_replace(:searchText, '\\s+', ':* & ', 'g') || ':*'))
			AND (:genderList IS NULL OR gender IN :genderList)
			  AND (:minExp IS NULL OR experience_years >= :minExp)
			  AND (:maxExp IS NULL OR experience_years <= :maxExp)
			  AND (
			      COALESCE(:specializationIds, '{}') = '{}' OR
			      specialization_ids && :specializationIds
			  )
			  AND (
			      COALESCE(:languageIds, '{}') = '{}' OR
			      language_ids && :languageIds
			  )
			""", countQuery = """
			SELECT COUNT(*) FROM doctor_branch_map_view
			WHERE (:searchText IS NULL OR :searchText = '' OR search_vector @@ to_tsquery('simple', regexp_replace(:searchText, '\\s+', ':* & ', 'g') || ':*'))
			AND (:genderList IS NULL OR gender IN :genderList)
			  AND (:minExp IS NULL OR experience_years >= :minExp)
			  AND (:maxExp IS NULL OR experience_years <= :maxExp)
			  AND (
			      COALESCE(:specializationIds, '{}') = '{}' OR
			      specialization_ids && :specializationIds
			  )
			  AND (
			      COALESCE(:languageIds, '{}') = '{}' OR
			      language_ids && :languageIds
			  )
			""", nativeQuery = true)
	Page<DoctorClinicMapProjection> filterDoctorPublic(
			@Param("genderList") List<Integer> genderList,
			@Param("minExp") Integer minExp,
			@Param("maxExp") Integer maxExp,
			@Param("specializationIds") Integer[] specializationIds,
			@Param("languageIds") Integer[] languageIds,
			@Param("searchText") String searchText,
			Pageable pageable);

	Optional<Doctor> findBySlug(String slug);

	@Query("SELECT DISTINCT d FROM Doctor d " +
			"LEFT JOIN d.specializationList s " +
			"WHERE (:specialIds IS NULL OR s.id IN :specialIds) " +
			"AND d.verified = true " +
			"AND d.publishedOnline = true " +
			"AND d.deleted = false")

	Page<DoctorProj> doctorFilter(Pageable pageable, List<Number> specialIds);

	// Only non-deleted doctors by default
	List<DoctorProj> findAllByDeletedFalse();

	// Find doctor by ID and not deleted
	Optional<Doctor> findByIdAndDeletedFalse(Long id);

	// For admin or restore, allow fetching deleted
	Optional<Doctor> findById(Long id);

	// Add method to find by globalDoctorId for master schema sync
	Optional<Doctor> findByGlobalDoctorId(UUID globalDoctorId);

@Query("SELECT DISTINCT d FROM Doctor d " +
       "LEFT JOIN d.specializationList s " +
       "JOIN d.branchList bl " +
       "WHERE (:specialIds IS NULL OR s.id IN :specialIds) " +
       "AND (:clinicId IS NULL OR bl.branch.clinic.id = :clinicId) " +
       "AND d.verified = true " +
       "AND d.publishedOnline = true " +
       "AND d.deleted = false")
List<DoctorProj> getVerifyDoctorForClinicFilter(@Param("specialIds") List<Long> specialIds,
                                                @Param("clinicId") Long clinicId);

}
