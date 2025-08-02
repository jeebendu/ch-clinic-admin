package com.jee.clinichub.app.courier.service;

import java.util.List;

import com.jee.clinichub.app.courier.model.Courier;
import com.jee.clinichub.app.courier.model.CourierDto;
import com.jee.clinichub.global.model.Status;

public interface CourierService {
	
	//Courier findByName(String name);

	CourierDto getById(Long id);

	Status deleteById(Long id);

	Status saveOrUpdate(CourierDto Branch);

	List<CourierDto> getAllCouriers();

	Courier getCourierById(Long id);
}
