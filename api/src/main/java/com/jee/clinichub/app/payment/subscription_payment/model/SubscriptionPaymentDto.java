package com.jee.clinichub.app.payment.subscription_payment.model;

import java.util.Date;

import com.jee.clinichub.app.admin.subscription.plan.model.Plan;
import com.jee.clinichub.global.tenant.model.Tenant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionPaymentDto {

    private Long id;
    private String paymentId;
    private String invoiceId;
    private Plan plan;
    private Tenant tenant;
    private Date createdTime;
    private Date startDate;
    private Date endDate;
    private Date trialEndsDate;
    private Date cencelledDate;
    private Date nextBillingDate;

    public SubscriptionPaymentDto(SubscriptionPayment subscriptionPayment) {
        this.id = subscriptionPayment.getId();
        this.paymentId = subscriptionPayment.getPaymentId();
        this.invoiceId = subscriptionPayment.getInvoiceId();
        this.plan = subscriptionPayment.getPlan();
        this.tenant = subscriptionPayment.getTenant();
        this.createdTime = subscriptionPayment.getCreatedTime();
        this.startDate = subscriptionPayment.getStartDate();
        this.endDate = subscriptionPayment.getEndDate();
        this.trialEndsDate = subscriptionPayment.getTrialEndsDate();
        this.cencelledDate = subscriptionPayment.getCencelledDate();
        this.nextBillingDate = subscriptionPayment.getNextBillingDate();

    }
}
