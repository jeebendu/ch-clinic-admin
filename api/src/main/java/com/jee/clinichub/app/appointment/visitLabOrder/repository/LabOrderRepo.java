package com.jee.clinichub.app.appointment.visitLabOrder.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.appointment.visitLabOrder.model.LabOrder;

@Repository
public interface LabOrderRepo extends JpaRepository<LabOrder,Long>{

    List<LabOrder> findAllByVisit_patient_id(Long patientId);

  

    
}
