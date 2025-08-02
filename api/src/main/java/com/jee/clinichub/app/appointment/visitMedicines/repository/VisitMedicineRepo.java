package com.jee.clinichub.app.appointment.visitMedicines.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.appointment.visitMedicines.model.Medicines;


@Repository
public interface VisitMedicineRepo extends JpaRepository<Medicines,Long>{

    List<Medicines> findAllByVisit_id(Long visitId);
    
}
