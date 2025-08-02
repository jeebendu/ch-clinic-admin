package com.jee.clinichub.app.patient.patientRelation.service;

import java.util.List;
import java.util.UUID;

import com.jee.clinichub.app.patient.patientRelation.model.RelationWith;
import com.jee.clinichub.app.patient.patientRelation.model.RelationWithDTO;
import com.jee.clinichub.global.model.Status;

public interface RelationWithService {

    Status delete(Long id);

    Status saveOrUpdate(RelationWithDTO relationWithDTO);

    List<RelationWithDTO> findAllByPatientId(Long patientId);

    List<RelationWithDTO> findAll();

    RelationWithDTO findById(Long id);

    RelationWith findByGlobalId(UUID globalId);

}
