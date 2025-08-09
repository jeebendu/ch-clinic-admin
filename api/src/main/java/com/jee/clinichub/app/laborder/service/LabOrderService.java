
package com.jee.clinichub.app.laborder.service;

import java.util.List;

import com.jee.clinichub.app.laborder.model.LabOrderDTO;
import com.jee.clinichub.app.laborder.model.enums.LabOrderStatus;
import com.jee.clinichub.global.model.Status;

public interface LabOrderService {

    List<LabOrderDTO> getAllLabOrders();
    
    LabOrderDTO getLabOrderById(Long id);
    
    Status saveOrUpdate(LabOrderDTO labOrderDTO);
    
    Status deleteById(Long id);
    
    Status updateStatus(Long id, LabOrderStatus status);
    
    List<LabOrderDTO> getLabOrdersByPatientId(Long patientId);
    
    List<LabOrderDTO> getLabOrdersByVisitId(Long visitId);
    
    List<LabOrderDTO> getLabOrdersByBranchId(Long branchId);
    
    List<LabOrderDTO> getLabOrdersByStatus(LabOrderStatus status);
    
    List<LabOrderDTO> getLabOrdersByBranchIdAndStatus(Long branchId, LabOrderStatus status);
    
    List<LabOrderDTO> getLabOrdersByPatientIdAndBranchId(Long patientId, Long branchId);
    
    List<LabOrderDTO> searchByOrderNumber(String orderNumber);
    
    List<LabOrderDTO> searchByReferringDoctor(String doctorName);
    
    List<LabOrderDTO> searchByBranchIdAndOrderNumber(Long branchId, String orderNumber);
    
    List<LabOrderDTO> searchByBranchIdAndReferringDoctor(Long branchId, String doctorName);
    
    Status generateOrderNumber(LabOrderDTO labOrderDTO);
}
