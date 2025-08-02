package com.jee.clinichub.app.appointment.visitLabOrder.controller;

import java.util.List;

import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.appointment.visitLabOrder.model.LabOrderDTO;
import com.jee.clinichub.app.appointment.visitLabOrder.service.LabOrderService;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/lab-order")
@RequiredArgsConstructor
public class LabOrderController {

    private final LabOrderService labOrderService;

    @GetMapping(value = "/list")
    public List<LabOrderDTO> getAll() {
        return labOrderService.getAll();
    }

    @GetMapping(value = "/id/{id}")
    public LabOrderDTO getById(@PathVariable Long id) {
        return labOrderService.getById(id);
    }

    @PostMapping(value = "/saveOrUpdate")
    public Status saveOrUpdate(@RequestBody @Valid LabOrderDTO LabOrderDTO, HttpServletRequest request, Errors errors) {
        return labOrderService.saveOrUpdate(LabOrderDTO);
    }

    @DeleteMapping(value = "/delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
        return labOrderService.deleteById(id);
    }

    @GetMapping(value = "/status-complete/id/{id}")
    public Status updateStatus(@PathVariable Long id) {
        return labOrderService.updateStatus(id);
    }

    @GetMapping(value = "/patient-id/{patientId}")
    public List<LabOrderDTO> findAllByPatientId(@PathVariable Long patientId) {
        return labOrderService.findAllByPatientId(patientId);
    }

}