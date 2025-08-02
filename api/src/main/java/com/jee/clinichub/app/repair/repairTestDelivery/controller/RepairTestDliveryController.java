package com.jee.clinichub.app.repair.repairTestDelivery.controller;

import java.util.List;

import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.repair.repairTestDelivery.Service.RepairTestDeliveryService;
import com.jee.clinichub.app.repair.repairTestDelivery.model.RepairTestDeliveryDto;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/v1/repairTestDelivery")
public class RepairTestDliveryController {

    @Autowired RepairTestDeliveryService repairTestDeliveryService;

    @GetMapping("/list")
     public List<RepairTestDeliveryDto> getAll() {
        return repairTestDeliveryService.getAll();
     }

     @PostMapping("/saveOrUpdate")
     public Status saveOrUpdate( @RequestBody @Valid RepairTestDeliveryDto repairTestDeliveryDto) {
       return repairTestDeliveryService.saveOrUpdate(repairTestDeliveryDto);
     }

       @GetMapping("/delete/id/{id}")
     public Status delete(@PathVariable Long id) {
        return repairTestDeliveryService.delete(id);
     }

     @GetMapping("/get/id/{id}")
     public RepairTestDeliveryDto getById(@PathVariable Long id) {
        return repairTestDeliveryService.getById(id);
     }
     
     @GetMapping("/repairId/{id}")
     public RepairTestDeliveryDto getByRId(@PathVariable Long id) {
        return repairTestDeliveryService.getByRId(id);
     }

     
    
}
