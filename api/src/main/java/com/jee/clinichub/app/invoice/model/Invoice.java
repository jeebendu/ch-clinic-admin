package com.jee.clinichub.app.invoice.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.jee.clinichub.app.appointment.visitLabResult.model.LabResult;
import com.jee.clinichub.app.appointment.visitPayment.model.Payment;
import com.jee.clinichub.app.appointment.visitPayment.model.PaymentDTO;
import com.jee.clinichub.app.patient.schedule.model.Schedule;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "visit_invoice")
@ToString
@EqualsAndHashCode(callSuper = false, exclude = {"payments"})
public class Invoice extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "visit_id")
    private Schedule visit;

    @Column(name = "total_amount")
    private Double totalAmount;
    @Column(name = "paid_amount")
    private Double paidAmount;
    
     @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private InvoiceStatus status;


    @JsonManagedReference
    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    List<Payment> payments = new ArrayList<Payment>();

    public Invoice(InvoiceDTO invoice) {

        if (invoice.getId() != null) {
            this.id = invoice.getId();
        }
        this.totalAmount = invoice.getTotalAmount();
        this.paidAmount = invoice.getPaidAmount();
        this.status = invoice.getStatus();

        // For payment 
        invoice.getPayments().forEach(item -> {
            Payment paymentObj = new Payment(item);
            paymentObj.setInvoice(this);
            this.payments.add(paymentObj);
        });
    }

}
