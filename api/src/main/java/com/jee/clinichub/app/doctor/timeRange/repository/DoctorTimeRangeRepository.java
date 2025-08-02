
package com.jee.clinichub.app.doctor.timeRange.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.doctor.timeRange.model.DoctorTimeRange;

@Repository
public interface DoctorTimeRangeRepository extends JpaRepository<DoctorTimeRange, Long> {

    List<DoctorTimeRange> findByAvailability_Id(Long availabilityId);

    void deleteByAvailability_Id(Long availabilityId);

    List<DoctorTimeRange> findByAvailability_IdOrderByStartTimeAsc(Long availabilityId);
}
