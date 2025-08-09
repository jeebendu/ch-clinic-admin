
package com.jee.clinichub.app.laborder.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.laborder.model.LabOrderItem;
import com.jee.clinichub.app.laborder.model.enums.LabOrderItemStatus;

@Repository
public interface LabOrderItemRepository extends JpaRepository<LabOrderItem, Long> {

    List<LabOrderItem> findAllByLabOrder_id(Long labOrderId);
    
    List<LabOrderItem> findAllByTestTypeId(Long testTypeId);
    
    List<LabOrderItem> findAllByStatus(LabOrderItemStatus status);
    
    List<LabOrderItem> findAllByLabOrder_idAndStatus(Long labOrderId, LabOrderItemStatus status);
    
    List<LabOrderItem> findAllBySampleCollected(Boolean sampleCollected);
}
