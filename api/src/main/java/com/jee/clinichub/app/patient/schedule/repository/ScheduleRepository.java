
package com.jee.clinichub.app.patient.schedule.repository;

import java.util.List;
import java.util.Date;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.jee.clinichub.app.patient.schedule.model.Schedule;
import com.jee.clinichub.app.patient.schedule.model.ScheduleCountDTO;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

	List<Schedule> findAllByPatient_User_Branch_idOrderByIdDesc(Long branchId);

	List<Schedule> findAllByPatient_id(Long pid);

	// List<Schedule> findAllByReferByDoctor_idAndPatient_branch_id(Long id, Long
	// id2);

	List<Schedule> findAllByReferByDoctor_idAndPatient_branch_id(Long id, Long id2);

	List<Schedule> findAllByReferByDoctor_idAndPatient_branch_idAndCreatedTimeBetween(Long id, Long id2, Date fromDate,
			Date toDate);

	@Cacheable(value = "scheduleCache", keyGenerator = "multiTenantCacheKeyGenerator")
	Page<Schedule> findAllByPatient_User_Branch_idOrderByIdDesc(Long branchId, Pageable pageable);

	@Cacheable(value = "scheduleCache", keyGenerator = "multiTenantCacheKeyGenerator")
	@Query("SELECT s FROM Schedule s " +
		   "WHERE s.patient.user.branch.id = :branchId " +
		   "AND (:doctorId IS NULL OR s.referByDoctor.id = :doctorId) " +
		   "AND (:patientName IS NULL OR :patientName = '' OR " +
		   "LOWER(CONCAT(s.patient.firstname, ' ', s.patient.lastname)) LIKE LOWER(CONCAT('%', :patientName, '%'))) " +
		   "ORDER BY s.id DESC")
	Page<Schedule> findSchedulesByBranchWithFilters(
		@Param("branchId") Long branchId,
		@Param("doctorId") Long doctorId,
		@Param("patientName") String patientName,
		Pageable pageable);
		
	@Cacheable(value = "scheduleCache", keyGenerator = "multiTenantCacheKeyGenerator")
	@Query("SELECT new com.jee.clinichub.app.patient.schedule.model.ScheduleCountDTO(s.referByDoctor, COUNT(s), FUNCTION('DATE', s.createdTime)) " +
	"FROM Schedule s " +
	"WHERE s.patient.user.branch.id = :branchId " +
	"AND (:month IS NULL OR EXTRACT(MONTH FROM s.createdTime) = :month) " +
	"AND (:year IS NULL OR EXTRACT(YEAR FROM s.createdTime) = :year) " +
	"GROUP BY s.referByDoctor, FUNCTION('DATE', s.createdTime) " +
	"ORDER BY s.referByDoctor, FUNCTION('DATE', s.createdTime)")
List<ScheduleCountDTO> countSchedulesByReferByDoctorAndUniqueDate(Long branchId, Integer month, Integer year);

}
