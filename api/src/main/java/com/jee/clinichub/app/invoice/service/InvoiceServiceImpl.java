package com.jee.clinichub.app.invoice.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jee.clinichub.app.appointment.visitLabOrder.model.LabOrder;
import com.jee.clinichub.app.appointment.visitLabOrder.model.LabOrderDTO;
import com.jee.clinichub.app.appointment.visitLabResult.model.LabResult;
import com.jee.clinichub.app.appointment.visitLabResult.model.LabResultDTO;
import com.jee.clinichub.app.appointment.visitPayment.model.Payment;
import com.jee.clinichub.app.appointment.visitPayment.model.PaymentDTO;
import com.jee.clinichub.app.invoice.model.Invoice;
import com.jee.clinichub.app.invoice.model.InvoiceDTO;
import com.jee.clinichub.app.invoice.repository.InvoiceRepo;
import com.jee.clinichub.app.patient.schedule.model.Schedule;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepo invoiceRepo;

    @Override
    public List<InvoiceDTO> getAll() {
        List<Invoice> invoices = invoiceRepo.findAll();
        return invoices.stream().map(InvoiceDTO::new).collect(Collectors.toList());
    }

    @Override
    public InvoiceDTO getById(Long id) {
        Optional<Invoice> invoice = invoiceRepo.findById(id);
        if (invoice.isPresent()) {
            return new InvoiceDTO(invoice.get());
        }
        throw new RuntimeException("Invoice not found with ID: " + id);
    }

    @Override
    public Status saveOrUpdate(InvoiceDTO invoiceDTO) {
        try {
            Invoice invoice = invoiceDTO.getId() == null ? new Invoice(invoiceDTO) : setInvoice(invoiceDTO);
            invoiceRepo.save(invoice);
            return new Status(true, (invoiceDTO.getId() == null ? "Added" : "Updated") + " Successfully");
        } catch (Exception e) {
            return new Status(false, "Failed to save or update Invoice: " + e.getMessage());
        }
    }

    public Invoice setInvoice(InvoiceDTO invoiceDTO) {
        Invoice existingInvoice = invoiceRepo.findById(invoiceDTO.getId()).orElseThrow(() -> {
            throw new EntityNotFoundException("Invoice Not Found With Id: " + invoiceDTO.getId());
        });
        existingInvoice.setVisit(new Schedule(invoiceDTO.getVisit()));
        existingInvoice.setTotalAmount(invoiceDTO.getTotalAmount());
        existingInvoice.setPaidAmount(invoiceDTO.getPaidAmount());
        existingInvoice.setStatus(invoiceDTO.getStatus());

        // === Payment ===
        List<Payment> paymentExist = existingInvoice.getPayments();
        List<Long> dtoLabResultIds = invoiceDTO.getPayments().stream()
                .map(PaymentDTO::getId)
                .collect(Collectors.toList());
        paymentExist.removeIf(existing -> !dtoLabResultIds.contains(existing.getId()));
        invoiceDTO.getPayments().forEach(dto -> {
            Payment payment = paymentExist.stream()
                    .filter(existing -> existing.getId() != null && existing.getId().equals(dto.getId()))
                    .findFirst()
                    .map(existing -> updatePayment(existing, dto))
                    .orElseGet(() -> createPayment(dto, existingInvoice));
            if (!paymentExist.contains(payment)) {
                paymentExist.add(payment);
            }
        });

        return existingInvoice;
    }

    public Payment updatePayment(Payment existingPayment, PaymentDTO paymentDTO) {
        existingPayment.setInvoice(new Invoice(paymentDTO.getInvoice()));
        existingPayment.setAmount(paymentDTO.getAmount());
        existingPayment.setPaymentType(paymentDTO.getPaymentType());
        existingPayment.setPaidOn(paymentDTO.getPaidOn());
        return existingPayment;
    }

    public Payment createPayment(PaymentDTO dto, Invoice invoice) {
        Payment payment = new Payment(dto);
        payment.setInvoice(invoice);
        return payment;
    }

    @Override
    public Status deleteById(Long id) {
        try {
            Optional<Invoice> invoice = invoiceRepo.findById(id);
            if (!invoice.isPresent()) {
                return new Status(false, "Invoice not found with ID: " + id);
            }
            invoiceRepo.deleteById(id);
            return new Status(true, "Deleted Successfully");
        } catch (Exception e) {
            return new Status(false, "Failed to delete Invoice: " + e.getMessage());
        }
    }

    @Override
    public List<InvoiceDTO> findAllByVisitId(Long id) {
        return invoiceRepo.findAllByVisit_id(id).stream().map(InvoiceDTO::new).collect(Collectors.toList());
    }

    @Override
    public List<InvoiceDTO> findAllByPatientId(Long patientId) {
               List<Invoice> invoices =invoiceRepo.findAllByVisit_patient_id(patientId);
       return invoices.stream().map(InvoiceDTO::new).collect(Collectors.toList());
    }

}