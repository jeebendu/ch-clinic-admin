package com.jee.clinichub.app.invoice.model;

import java.util.ArrayList;
import java.util.List;

import com.jee.clinichub.app.appointment.visitPayment.model.Payment;
import com.jee.clinichub.app.appointment.visitPayment.model.PaymentDTO;
import com.jee.clinichub.app.patient.schedule.model.ScheduleDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class InvoiceDTO {

    private Long id;
    private ScheduleDto visit;
    private Double totalAmount;
    private Double paidAmount;
    private InvoiceStatus status;
    List<PaymentDTO> payments = new ArrayList<PaymentDTO>();

    public InvoiceDTO(Invoice invoice) {

        if (invoice.getId() != null) {
            this.id = invoice.getId();
        }
        // this.visit = new ScheduleDto(invoice.getVisit());
        this.totalAmount = invoice.getTotalAmount();
        this.paidAmount = invoice.getPaidAmount();
        this.status = invoice.getStatus();

        // For payment
        invoice.getPayments().forEach(item -> {
            this.payments.add(new PaymentDTO(item));
        });
    }
}
