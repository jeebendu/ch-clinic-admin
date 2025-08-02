package com.jee.clinichub.app.appointment.visitPayment.model;

import java.util.Date;
import com.jee.clinichub.app.invoice.model.InvoiceDTO;
import com.jee.clinichub.app.payment.type.model.PaymentType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class PaymentDTO {
    
    private Long id;
    private InvoiceDTO invoice;
    private Double amount;
    private PaymentType paymentType;
    private Date paidOn;

    public PaymentDTO(Payment payment) {
        this.id = payment.getId();
        this.amount = payment.getAmount();
        this.paymentType = payment.getPaymentType();
        this.paidOn = payment.getPaidOn();
    }
}
