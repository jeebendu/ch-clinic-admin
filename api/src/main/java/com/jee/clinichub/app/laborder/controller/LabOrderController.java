
package com.jee.clinichub.app.laborder.controller;

import java.util.List;

import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.laborder.model.LabOrderDTO;
import com.jee.clinichub.app.laborder.model.enums.LabOrderStatus;
import com.jee.clinichub.app.laborder.service.LabOrderService;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/lab-orders")
@RequiredArgsConstructor
public class LabOrderController {

    private final LabOrderService labOrderService;

    @GetMapping(value = "/list")
    public List<LabOrderDTO> getAllLabOrders() {
        return labOrderService.getAllLabOrders();
    }

    @GetMapping(value = "/id/{id}")
    public LabOrderDTO getById(@PathVariable Long id) {
        return labOrderService.getLabOrderById(id);
    }

    @PostMapping(value = "/saveOrUpdate")
    public Status saveOrUpdate(@RequestBody @Valid LabOrderDTO labOrderDTO, 
                               HttpServletRequest request, Errors errors) {
        return labOrderService.saveOrUpdate(labOrderDTO);
    }

    @DeleteMapping(value = "/delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
        return labOrderService.deleteById(id);
    }

    @PutMapping(value = "/update-status/id/{id}")
    public Status updateStatus(@PathVariable Long id, @RequestParam LabOrderStatus status) {
        return labOrderService.updateStatus(id, status);
    }

    @GetMapping(value = "/patient/{patientId}")
    public List<LabOrderDTO> getLabOrdersByPatientId(@PathVariable Long patientId) {
        return labOrderService.getLabOrdersByPatientId(patientId);
    }

    @GetMapping(value = "/visit/{visitId}")
    public List<LabOrderDTO> getLabOrdersByVisitId(@PathVariable Long visitId) {
        return labOrderService.getLabOrdersByVisitId(visitId);
    }

    @GetMapping(value = "/status/{status}")
    public List<LabOrderDTO> getLabOrdersByStatus(@PathVariable LabOrderStatus status) {
        return labOrderService.getLabOrdersByStatus(status);
    }

    @GetMapping(value = "/search/order-number")
    public List<LabOrderDTO> searchByOrderNumber(@RequestParam String orderNumber) {
        return labOrderService.searchByOrderNumber(orderNumber);
    }

    @GetMapping(value = "/search/doctor")
    public List<LabOrderDTO> searchByReferringDoctor(@RequestParam String doctorName) {
        return labOrderService.searchByReferringDoctor(doctorName);
    }

    @PostMapping(value = "/generate-order-number")
    public Status generateOrderNumber(@RequestBody LabOrderDTO labOrderDTO) {
        return labOrderService.generateOrderNumber(labOrderDTO);
    }
}
