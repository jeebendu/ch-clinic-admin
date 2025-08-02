package com.jee.clinichub.app.appointment.visitPayment.controller;

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

import com.jee.clinichub.app.appointment.visitPayment.model.PaymentDTO;
import com.jee.clinichub.app.appointment.visitPayment.service.PaymentService;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/payments")
@RequiredArgsConstructor
public class PaymentController {
    
    private final PaymentService paymentService;

    @GetMapping(value = "/list")
    public List<PaymentDTO> getAll() {
        return paymentService.getAll();
    }

    @GetMapping(value = "/id/{id}")
    public PaymentDTO getById(@PathVariable Long id) {
        return paymentService.getById(id);
    }

    @PostMapping(value = "/saveOrUpdate")
    public Status saveOrUpdate(@RequestBody @Valid PaymentDTO paymentDTO, HttpServletRequest request, Errors errors) {
        return paymentService.saveOrUpdate(paymentDTO);
    }

    @DeleteMapping(value = "/delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
        return paymentService.deleteById(id);
    }

    @GetMapping(value = "/invoice-id/{id}")
    public List<PaymentDTO> getAllByInvoiceId(@PathVariable Long id) {
        return paymentService.getAllByInvoiceId(id);
    }
}