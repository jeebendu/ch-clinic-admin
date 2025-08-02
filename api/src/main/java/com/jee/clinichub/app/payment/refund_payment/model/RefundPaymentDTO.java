package com.jee.clinichub.app.payment.refund_payment.model;

import java.util.Date;

import com.jee.clinichub.app.payment.subscription_payment.model.SubscriptionPayment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RefundPaymentDTO {


    private Long id;
    private String paymentId;
    private String invoiceId;
    private SubscriptionPayment subscriptionPayment;
    private String refundamount;
    private Date createdTime;


        public RefundPaymentDTO(RefundPayment refundPayment) {
            this.id = refundPayment.getId();
            this.paymentId = refundPayment.getPaymentId();
            this.invoiceId = refundPayment.getInvoiceId();
            this.subscriptionPayment = refundPayment.getSubscriptionPayment();
            this.refundamount = refundPayment.getRefundamount();
            this.createdTime = refundPayment.getCreatedTime();
        }
    
}
