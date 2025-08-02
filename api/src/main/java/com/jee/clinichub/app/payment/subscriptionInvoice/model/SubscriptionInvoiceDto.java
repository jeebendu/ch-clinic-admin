package com.jee.clinichub.app.payment.subscriptionInvoice.model;

import com.jee.clinichub.app.payment.type.model.PaymentType;
import com.jee.clinichub.global.tenant.model.TenantDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SubscriptionInvoiceDto {
    private Long id;
    private TenantDto tenant;
    private Double totalAmount;
    private Double paidAmount;

    private PaymentType paymentType;
    private SubPaymentStatus status;

   private  TenantPaymentDTO  payment = new TenantPaymentDTO();

    public SubscriptionInvoiceDto(SubscriptionInvoice subscriptionInvoice) {

        if (subscriptionInvoice.getId() != null) {
            this.id = subscriptionInvoice.getId();
        }
        this.totalAmount = subscriptionInvoice.getTotalAmount();
        this.paidAmount = subscriptionInvoice.getPaidAmount();
        this.status = subscriptionInvoice.getStatus();
        this.tenant=new TenantDto(subscriptionInvoice.getTenant());
        this.paymentType=subscriptionInvoice.getPaymentType();
        this.payment= new TenantPaymentDTO(subscriptionInvoice.getPayment());
    }
}
