package com.jee.clinichub.app.appointment.symptoms.service;


import java.util.List;

import com.jee.clinichub.app.appointment.symptoms.model.Symptoms;
import com.jee.clinichub.app.appointment.symptoms.model.SymptomsDto;
import com.jee.clinichub.global.model.Status;


public interface SymptomsService {
	


    SymptomsDto getById(Long id);

	Status deleteById(Long id);

    Status saveOrUpdate(SymptomsDto symptomsDto);

    List<SymptomsDto> getAll();

    List<Symptoms> filterSymptoms(SymptomsDto filter);
}
