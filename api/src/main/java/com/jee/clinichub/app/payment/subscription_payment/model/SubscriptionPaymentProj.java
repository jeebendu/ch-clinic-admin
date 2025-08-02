package com.jee.clinichub.app.payment.subscription_payment.model;

import java.util.Date;

import com.jee.clinichub.app.admin.subscription.plan.model.Plan;
import com.jee.clinichub.global.tenant.model.Tenant;

public interface SubscriptionPaymentProj {
    
    Long getId();
    String getPaymentId();
    String getInvoiceId();
    Plan getPlan();
    Tenant getTenant();
    Date getCreatedTime();
    Date getStartDate();
    Date getEndDate();
    Date getTrialEndsDate();
    Date getCencelledDate();
    Date getNextBillingDate();
}
