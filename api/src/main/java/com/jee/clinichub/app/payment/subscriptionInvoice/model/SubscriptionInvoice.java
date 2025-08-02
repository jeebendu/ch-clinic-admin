package com.jee.clinichub.app.payment.subscriptionInvoice.model;
import java.io.Serializable;

import com.jee.clinichub.app.payment.type.model.PaymentType;
import com.jee.clinichub.config.audit.Auditable;
import com.jee.clinichub.global.tenant.model.Tenant;

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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="subscription_invoice")
@ToString
public class SubscriptionInvoice extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    @OneToOne
    @JoinColumn(name = "tenant_id")
    private Tenant tenant;

    @Column(name = "total_amount")
    private Double totalAmount;
    @Column(name = "paid_amount")
    private Double paidAmount;

     @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private SubPaymentStatus status;

    @OneToOne
    @JoinColumn(name="payment_type_id")
    private PaymentType paymentType;



    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinColumn(name = "payment_id")
     private TenantPayment payment = new TenantPayment();

    public SubscriptionInvoice(SubscriptionInvoiceDto subscriptionInvoice) {

        if (subscriptionInvoice.getId() != null) {
            this.id = subscriptionInvoice.getId();
        }
        this.totalAmount = subscriptionInvoice.getTotalAmount();
        this.paidAmount = subscriptionInvoice.getPaidAmount();
        this.status = subscriptionInvoice.getStatus();
        this.tenant=new Tenant(subscriptionInvoice.getTenant());
        this.paymentType=subscriptionInvoice.getPaymentType();


    }

}
