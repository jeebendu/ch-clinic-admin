
package com.jee.clinichub.app.laborder.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.laborder.model.LabOrderV2;
import com.jee.clinichub.app.laborder.model.enums.LabOrderStatus;

@Repository
public interface LabOrderV2Repository extends JpaRepository<LabOrderV2, Long> {

    List<LabOrderV2> findAllByPatient_id(Long patientId);
    
    List<LabOrderV2> findAllByVisitId(Long visitId);
    
    List<LabOrderV2> findAllByBranchId(Long branchId);
    
    List<LabOrderV2> findAllByStatus(LabOrderStatus status);
    
    List<LabOrderV2> findAllByBranchIdAndStatus(Long branchId, LabOrderStatus status);
    
    List<LabOrderV2> findAllByPatient_idAndStatus(Long patientId, LabOrderStatus status);
    
    List<LabOrderV2> findAllByPatient_idAndBranchId(Long patientId, Long branchId);
    
    boolean existsByOrderNumber(String orderNumber);
    
    @Query("SELECT l FROM LabOrderV2 l WHERE l.orderNumber LIKE %:orderNumber%")
    List<LabOrderV2> findByOrderNumberContaining(@Param("orderNumber") String orderNumber);
    
    @Query("SELECT l FROM LabOrderV2 l WHERE l.referringDoctor LIKE %:doctorName%")
    List<LabOrderV2> findByReferringDoctorContaining(@Param("doctorName") String doctorName);
    
    @Query("SELECT l FROM LabOrderV2 l WHERE l.branchId = :branchId AND l.orderNumber LIKE %:orderNumber%")
    List<LabOrderV2> findByBranchIdAndOrderNumberContaining(@Param("branchId") Long branchId, @Param("orderNumber") String orderNumber);
    
    @Query("SELECT l FROM LabOrderV2 l WHERE l.branchId = :branchId AND l.referringDoctor LIKE %:doctorName%")
    List<LabOrderV2> findByBranchIdAndReferringDoctorContaining(@Param("branchId") Long branchId, @Param("doctorName") String doctorName);
}
