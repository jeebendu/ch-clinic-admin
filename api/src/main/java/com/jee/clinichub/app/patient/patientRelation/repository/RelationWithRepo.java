package com.jee.clinichub.app.patient.patientRelation.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.patient.patientRelation.model.RelationWith;

@Repository
public interface RelationWithRepo extends JpaRepository<RelationWith,Long>{

    List<RelationWith> findAllByPatient_id(Long patientId);

    Optional<RelationWith> findByGlobalId(UUID globalId);
    
}
