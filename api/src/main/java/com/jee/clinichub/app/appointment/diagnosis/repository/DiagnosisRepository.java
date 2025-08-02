package com.jee.clinichub.app.appointment.diagnosis.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.appointment.diagnosis.model.Diagnosis;
import com.jee.clinichub.app.appointment.diagnosis.model.DiagnosisDto;

@Repository
public interface DiagnosisRepository extends JpaRepository<Diagnosis, Long> {

   

    List<Diagnosis> findByOrderByNameAsc();

    boolean existsByNameAndIdNot(String name, Long id);

    @Query("SELECT s FROM Diagnosis s WHERE (:name IS NULL OR LOWER(s.name) LIKE CONCAT('%', :name, '%'))")
    List<DiagnosisDto> filterByName(Object object);

    boolean existsByName(String name);

}
