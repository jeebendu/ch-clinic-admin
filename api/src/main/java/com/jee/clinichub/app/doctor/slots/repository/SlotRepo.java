
package com.jee.clinichub.app.doctor.slots.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.doctor.slots.model.Slot;
import com.jee.clinichub.app.doctor.slots.model.SlotProj;
import com.jee.clinichub.app.doctor.slots.model.SlotStatus;

@Repository
public interface SlotRepo extends JpaRepository<Slot, Long> {

    @Query("SELECT s FROM Slot s WHERE s.doctorBranch.doctor.id = :doctorId AND s.doctorBranch.branch.id = :branchId AND s.date = :date")
    List<SlotProj> getFilteredSlots(Long doctorId, Long branchId, String date);

    boolean existsByDoctorBranch_idAndDateAndEndTime(long id, Date date, LocalTime startTime);

    List<Slot> findAllByDoctorBranch_idAndDate(long id, Date date);

    boolean existsByDoctorBranch_doctor_idAndDoctorBranch_branch_idAndDateAndStartTimeAndEndTime(Long id, Long id2,
            Date dateValue, LocalTime currentStart, LocalTime currentEnd);

    List<Slot> findAllByDoctorBranch_globalDoctorBranchIdAndDateGreaterThanEqual(UUID doctorBranchGlobalId, Date date);

    Collection<Slot> findAllByGlobalSlotIdIn(List<UUID> globalSlotIds);

    Optional<Slot> findAllByGlobalSlotId(UUID globalId);

    boolean existsByDoctorBranch_idAndDateAndStartTimeAndEndTime(Long id, Date dateValue, LocalTime currentStart,
            LocalTime currentEnd);

    List<Slot> findAllByDoctorBranch_globalDoctorBranchIdAndDateBetween(UUID doctorBranchGlobalId, Date startOfDay,
            Date endOfDay);

    @Query("SELECT s FROM Slot s WHERE s.status = :status AND s.date BETWEEN :startDate AND :endDate")
    List<Slot> findPendingSlotsInDateRange(@Param("status") SlotStatus status, @Param("startDate") Date startDate, @Param("endDate") Date endDate);

    // Convenience method for finding pending slots
    default List<Slot> findPendingSlotsInDateRange(Date startDate, Date endDate) {
        return findPendingSlotsInDateRange(SlotStatus.PENDING, startDate, endDate);
    }

	boolean existsByDoctorBranch_idAndDateAndStartTimeAndEndTime(Long doctorBranchId, LocalDate date,
			LocalTime startTime, LocalTime endTime);
	
	
	@Query("SELECT s FROM Slot s WHERE s.startTime = :startTime AND s.endTime = :endTime")
	List<Slot> findByStartTimeAndEndTime(@Param("startTime") LocalTime startTime,
	                                     @Param("endTime") LocalTime endTime);
	
	
    List<Slot> findAllByDateBetween(Date start, Date end);

	Optional<Slot> findByGlobalSlotId(UUID globalSlotId);
}
