package com.jee.clinichub.app.appointment.visitPayment.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jee.clinichub.app.appointment.visitPayment.model.Payment;
import com.jee.clinichub.app.appointment.visitPayment.model.PaymentDTO;
import com.jee.clinichub.app.appointment.visitPayment.repository.PaymentRepo;
import com.jee.clinichub.app.invoice.model.Invoice;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepo paymentRepo;

    @Override
    public List<PaymentDTO> getAll() {
        List<Payment> payments = paymentRepo.findAll();
        return payments.stream().map(PaymentDTO::new).collect(Collectors.toList());
    }

    @Override
    public PaymentDTO getById(Long id) {
        Optional<Payment> payment = paymentRepo.findById(id);
        if (payment.isPresent()) {
            return new PaymentDTO(payment.get());
        }
        throw new RuntimeException("Payment not found with ID: " + id);
    }

    @Override
    public Status saveOrUpdate(PaymentDTO paymentDTO) {
        try {
            Payment payment = paymentDTO.getId() == null ? new Payment(paymentDTO) : setPayment(paymentDTO);
            paymentRepo.save(payment);
            return new Status(true, (paymentDTO.getId() == null ? "Added" : "Updated") + " Successfully");
        } catch (Exception e) {
            return new Status(false, "Failed to save or update Payment: " + e.getMessage());
        }
    }

    private Payment setPayment(PaymentDTO paymentDTO) {
        Payment existingPayment = paymentRepo.findById(paymentDTO.getId()).orElseThrow(() -> {
            throw new EntityNotFoundException("Payment Not Found With Id: " + paymentDTO.getId());
        });
        existingPayment.setInvoice(new Invoice(paymentDTO.getInvoice()));
        existingPayment.setAmount(paymentDTO.getAmount());
        existingPayment.setPaymentType(paymentDTO.getPaymentType());
        existingPayment.setPaidOn(paymentDTO.getPaidOn());
        return existingPayment;
    }

    @Override
    public Status deleteById(Long id) {
        try {
            Optional<Payment> payment = paymentRepo.findById(id);
            if (!payment.isPresent()) {
                return new Status(false, "Payment not found with ID: " + id);
            }
            paymentRepo.deleteById(id);
            return new Status(true, "Deleted Successfully");
        } catch (Exception e) {
            return new Status(false, "Failed to delete Payment: " + e.getMessage());
        }
    }

    @Override
    public List<PaymentDTO> getAllByInvoiceId(Long id) {
        return paymentRepo.findAllByInvoice_Id(id).stream().map(PaymentDTO::new).collect(Collectors.toList());
    }
}