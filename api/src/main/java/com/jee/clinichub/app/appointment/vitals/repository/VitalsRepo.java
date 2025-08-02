package com.jee.clinichub.app.appointment.vitals.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.appointment.vitals.model.Vitals;

@Repository
public interface VitalsRepo extends JpaRepository<Vitals, Long> {

    Vitals findBySchedule_id(Long id);

    boolean existsBySchedule_id(Long id);
    
}
