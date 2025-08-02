package com.jee.clinichub.app.appointment.visitLabResult.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.appointment.visitLabResult.model.LabResult;

@Repository
public interface LabResultRepo extends JpaRepository<LabResult,Long>{
    
}
