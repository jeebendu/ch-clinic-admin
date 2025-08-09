
package com.jee.clinichub.app.laborder.service;

import java.util.List;

import com.jee.clinichub.app.laborder.model.LabOrderItemDTO;
import com.jee.clinichub.app.laborder.model.enums.LabOrderItemStatus;
import com.jee.clinichub.global.model.Status;

public interface LabOrderItemService {

    List<LabOrderItemDTO> getAllLabOrderItems();
    
    LabOrderItemDTO getLabOrderItemById(Long id);
    
    Status saveOrUpdate(LabOrderItemDTO labOrderItemDTO);
    
    Status deleteById(Long id);
    
    Status updateStatus(Long id, LabOrderItemStatus status);
    
    List<LabOrderItemDTO> getLabOrderItemsByOrderId(Long labOrderId);
    
    List<LabOrderItemDTO> getLabOrderItemsByTestTypeId(Long testTypeId);
    
    List<LabOrderItemDTO> getLabOrderItemsByStatus(LabOrderItemStatus status);
    
    Status updateSampleCollection(Long id, Boolean collected);
}
