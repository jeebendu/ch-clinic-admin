package com.jee.clinichub.app.payment.refund_payment.model;

import java.io.Serializable;

import com.jee.clinichub.app.payment.subscription_payment.model.SubscriptionPayment;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="refund_payment")
public class RefundPayment extends Auditable<String>  implements Serializable  {
    

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;

    @Column(name="payment_id")
    private String paymentId;

    @Column(name=" invoice_id")
    private String invoiceId;

        @OneToOne
    @JoinColumn(
        name = "subscriptionPaymentHistory_id"
    )
    private SubscriptionPayment subscriptionPayment;

    @Column(name=" refund_amount")
    private String refundamount;



    public RefundPayment(RefundPaymentDTO refundAmountDTO) {
         this.id = refundAmountDTO.getId();
            this.paymentId = refundAmountDTO.getPaymentId();
            this.invoiceId = refundAmountDTO.getInvoiceId();
            this.subscriptionPayment = refundAmountDTO.getSubscriptionPayment();
            this.refundamount = refundAmountDTO.getRefundamount();

    }
}
