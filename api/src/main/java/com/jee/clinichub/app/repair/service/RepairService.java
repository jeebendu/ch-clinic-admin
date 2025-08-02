package com.jee.clinichub.app.repair.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.app.repair.model.AddressTypeDto;
import com.jee.clinichub.app.repair.model.Repair;
import com.jee.clinichub.app.repair.model.RepairCourierDto;
import com.jee.clinichub.app.repair.model.RepairDto;
import com.jee.clinichub.app.repair.model.RepairPaymentDto;
import com.jee.clinichub.app.repair.model.RepairStatusDto;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;

public interface RepairService {
	
    Repair findByName(String name);

    RepairDto getById(Long id);

	Status deleteById(Long id);

	Status saveOrUpdate(RepairDto Repair);

	List<RepairDto> getAllRepairs();

	List<Repair> getAllRepair();

	byte[] printById(Long id);

	List<RepairStatusDto> getRepairStatus();

	

	List<RepairCourierDto> getCourierByRepairId(Long repairId);

	byte[] printRepairPayment(Long id, Long payId);

	List<RepairPaymentDto> getPaymentByRepairId(Long repairId);

	Status saveOrUpdateRepairPayment(@Valid RepairPaymentDto repairPayment);

   List<AddressTypeDto> getAddressType();

   Status deletePaymentById(Long id);

Status deleteCourierById(Long id);

}
