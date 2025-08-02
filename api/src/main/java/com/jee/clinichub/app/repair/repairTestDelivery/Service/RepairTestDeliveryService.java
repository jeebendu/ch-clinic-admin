package com.jee.clinichub.app.repair.repairTestDelivery.Service;

import java.util.List;

import com.jee.clinichub.app.repair.repairTestDelivery.model.RepairTestDeliveryDto;
import com.jee.clinichub.global.model.Status;

public interface RepairTestDeliveryService {

    List<RepairTestDeliveryDto> getAll();

    Status saveOrUpdate(RepairTestDeliveryDto repairTestDeliveryDto);

    Status delete(Long id);

    RepairTestDeliveryDto getById(Long id);

	RepairTestDeliveryDto getByRId(Long id);

   
    
}
