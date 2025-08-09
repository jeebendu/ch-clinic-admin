
package com.jee.clinichub.app.laborder.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.laborder.model.LabOrder;
import com.jee.clinichub.app.laborder.model.enums.LabOrderStatus;

@Repository
public interface LabOrderRepository extends JpaRepository<LabOrder, Long> {

    List<LabOrder> findAllByPatient_id(Long patientId);
    
    List<LabOrder> findAllByVisitId(Long visitId);
    
    List<LabOrder> findAllByStatus(LabOrderStatus status);
    
    List<LabOrder> findAllByPatient_idAndStatus(Long patientId, LabOrderStatus status);
    
    boolean existsByOrderNumber(String orderNumber);
    
    @Query("SELECT l FROM LabOrder l WHERE l.orderNumber LIKE %:orderNumber%")
    List<LabOrder> findByOrderNumberContaining(@Param("orderNumber") String orderNumber);
    
    @Query("SELECT l FROM LabOrder l WHERE l.referringDoctor LIKE %:doctorName%")
    List<LabOrder> findByReferringDoctorContaining(@Param("doctorName") String doctorName);
}
