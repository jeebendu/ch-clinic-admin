package com.jee.clinichub.app.appointment.visitPayment.model;

import java.io.Serializable;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.jee.clinichub.app.invoice.model.Invoice;
import com.jee.clinichub.app.payment.type.model.PaymentType;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "visit_payment")
public class Payment extends Auditable<String>  implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "invoice_id")
    private Invoice invoice;

    private Double amount;
    @OneToOne
    @JoinColumn(name = "payment_type_id")
    private PaymentType paymentType;

    @Column(name = "paid_on")
    private Date paidOn;

        public Payment(PaymentDTO payment) {
        this.id = payment.getId();
        this.amount = payment.getAmount();
        this.paymentType = payment.getPaymentType();
        this.paidOn = payment.getPaidOn();
    }


}
