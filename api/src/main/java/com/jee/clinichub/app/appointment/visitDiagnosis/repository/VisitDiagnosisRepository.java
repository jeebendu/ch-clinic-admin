package com.jee.clinichub.app.appointment.visitDiagnosis.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.jee.clinichub.app.appointment.visitDiagnosis.model.VisitDiagnosis;

@Repository
public interface VisitDiagnosisRepository extends JpaRepository<VisitDiagnosis, Long> {

   

 

}
