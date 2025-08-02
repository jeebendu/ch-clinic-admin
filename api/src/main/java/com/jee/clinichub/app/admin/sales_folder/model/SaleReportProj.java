package com.jee.clinichub.app.admin.sales_folder.model;



import java.util.Date;


import com.jee.clinichub.app.admin.promo.coupons.model.CouponsProjection;
import com.jee.clinichub.app.payment.subscription_payment.model.SubscriptionPaymentProj;

public interface SaleReportProj {

    Long getId();
    SubscriptionPaymentProj getSubscriptionPayment();
    CouponsProjection getCoupons();
    Long getTotalAmount();
    String getPaymentType();
    String getPaymentStatus();
    Date getCreatedTime();

    
    
}
