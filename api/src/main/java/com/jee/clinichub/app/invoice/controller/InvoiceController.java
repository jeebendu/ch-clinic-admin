package com.jee.clinichub.app.invoice.controller;

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
import com.jee.clinichub.app.invoice.model.InvoiceDTO;
import com.jee.clinichub.app.invoice.service.InvoiceService;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping(value = "/list")
    public List<InvoiceDTO> getAll() {
        return invoiceService.getAll();
    }

    @GetMapping(value = "/id/{id}")
    public InvoiceDTO getById(@PathVariable Long id) {
        return invoiceService.getById(id);
    }

    @PostMapping(value = "/saveOrUpdate")
    public Status saveOrUpdate(@RequestBody @Valid InvoiceDTO invoiceDTO, HttpServletRequest request, Errors errors) {
        return invoiceService.saveOrUpdate(invoiceDTO);
    }

    @DeleteMapping(value = "/delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
        return invoiceService.deleteById(id);
    }

    @GetMapping(value = "/visit-id/{id}")
    public List<InvoiceDTO> findAllByVisitId(@PathVariable Long id) {
        return invoiceService.findAllByVisitId(id);
    }

     @GetMapping(value = "/patient-id/{patientId}")
    public List<InvoiceDTO> findAllByPatientId(@PathVariable Long patientId) {
        return invoiceService.findAllByPatientId(patientId);
    }

}