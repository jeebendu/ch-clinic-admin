
package com.jee.clinichub.app.patient.schedule.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.jee.clinichub.app.patient.schedule.model.DoctorReferralDto;
import com.jee.clinichub.app.patient.schedule.model.DrReferalSearch;
import com.jee.clinichub.app.patient.schedule.model.Schedule;
import com.jee.clinichub.app.patient.schedule.model.ScheduleDto;
import com.jee.clinichub.app.patient.schedule.model.SearchSchedule;
import com.jee.clinichub.global.model.Status;

public interface ScheduleService {
	
    ScheduleDto getById(Long id);

	Status deleteById(Long id);

	Status saveOrUpdate(ScheduleDto Schedule);

	List<ScheduleDto> getAllSchedules();

	Page<ScheduleDto> getAllSchedulesPaginated(Pageable pageable, SearchSchedule search);

	Schedule getScheduleById(Long id);

	List<ScheduleDto> getAllSchedulesByPID(Long pid);

    List<Schedule> getAllScheduleByRefDtos(SearchSchedule search);

    List<DoctorReferralDto> countUniqueScheduleByDateAndRefDotor(DrReferalSearch search);
}
