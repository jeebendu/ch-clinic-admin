package com.jee.clinichub.app.appointment.visitType.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.appointment.visitType.model.VisitType;

@Repository
public interface VisitTypeRepository extends JpaRepository<VisitType, Long> {

    List<VisitType> findAll();
    
}
