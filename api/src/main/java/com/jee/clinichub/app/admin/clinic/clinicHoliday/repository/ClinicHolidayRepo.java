
package com.jee.clinichub.app.admin.clinic.clinicHoliday.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.admin.clinic.clinicHoliday.model.ClinicHoliday;

@Repository
public interface ClinicHolidayRepo extends JpaRepository<ClinicHoliday, Long> {

    List<ClinicHoliday> findAllByBranch_id(Long id);

    boolean existsByBranch_idAndDate(Long id, Date dateValue);

   
    
}