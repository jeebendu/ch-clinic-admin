
package com.jee.clinichub.modules.queue.repository;

import com.jee.clinichub.modules.queue.entity.LiveVisitQueue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LiveVisitQueueRepository extends JpaRepository<LiveVisitQueue, Long> {

    @Query(value = "SELECT * FROM live_visit_queue " +
                   "WHERE branch_id = :branchId " +
                   "AND DATE(checkin_time) = :date " +
                   "ORDER BY actual_sequence", nativeQuery = true)
    List<LiveVisitQueue> findByBranchIdAndDateOrderByActualSequence(
            @Param("branchId") Long branchId, 
            @Param("date") LocalDate date);

    @Query(value = "SELECT * FROM live_visit_queue " +
                   "WHERE branch_id = :branchId " +
                   "AND DATE(checkin_time) = :date " +
                   "ORDER BY checkin_time", nativeQuery = true)
    List<LiveVisitQueue> findByBranchIdAndDateOrderByCheckinTime(
            @Param("branchId") Long branchId, 
            @Param("date") LocalDate date);

    @Query(value = "SELECT * FROM live_visit_queue " +
                   "WHERE branch_id = :branchId " +
                   "AND DATE(checkin_time) = :date " +
                   "ORDER BY actual_sequence " +
                   "LIMIT :limit", nativeQuery = true)
    List<LiveVisitQueue> findByBranchIdAndDateOrderByActualSequenceLimit(
            @Param("branchId") Long branchId, 
            @Param("date") LocalDate date, 
            @Param("limit") Integer limit);

    @Query(value = "SELECT COUNT(*) FROM live_visit_queue " +
                   "WHERE branch_id = :branchId " +
                   "AND DATE(checkin_time) = :date", nativeQuery = true)
    Long countByBranchIdAndDate(
            @Param("branchId") Long branchId, 
            @Param("date") LocalDate date);
}
