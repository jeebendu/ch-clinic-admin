package com.jee.clinichub.app.payment.subscriptionInvoice.model;

import java.sql.Date;
import com.jee.clinichub.app.payment.type.model.PaymentType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TenantPaymentDTO {
    
    private Long id;
    private Double amount;
    private PaymentType paymentType;
    private Date paidOn;
    public TenantPaymentDTO(TenantPayment tenantPayment) {
        this.id = tenantPayment.getId();
        this.amount = tenantPayment.getAmount();
        this.paymentType = tenantPayment.getPaymentType();
        this.paidOn = tenantPayment.getPaidOn();
}
}