package com.jee.clinichub.app.appointment.visitType.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.appointment.visitType.model.VisitType;
import com.jee.clinichub.app.appointment.visitType.repository.VisitTypeRepository;

@Service(value = "visitTypeService")
public class VisitTypeServiceImpl implements VisitTypeService{

    @Autowired
	private VisitTypeRepository visitTypeRepository;
   
    @Override
  public List<VisitType> getAllVisitType() {
		return visitTypeRepository.findAll();
	}
    
}
