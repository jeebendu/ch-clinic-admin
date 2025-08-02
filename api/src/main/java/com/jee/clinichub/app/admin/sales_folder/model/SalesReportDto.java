package com.jee.clinichub.app.admin.sales_folder.model;

import java.util.Date;


import com.jee.clinichub.app.admin.promo.coupons.model.Coupons;
import com.jee.clinichub.app.payment.subscription_payment.model.SubscriptionPayment;
import com.jee.clinichub.app.payment.subscription_payment.model.SubscriptionPaymentDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;





@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesReportDto {

    private Long id;
    private SubscriptionPayment subscriptionPayment;
    private Coupons coupons;
    private Long totalAmount;
    private String paymentType;
    private String paymentStatus;
    private Date createdTime;




    public SalesReportDto(SalesReport salesReport) {
        this.id = salesReport.getId();
        this.subscriptionPayment =salesReport.getSubscriptionPayment();
        this.coupons = salesReport.getCoupons();
        this.totalAmount = salesReport.getTotalAmount();
        this.paymentType = salesReport.getPaymentType();
        this.paymentStatus = salesReport.getPaymentStatus();
        this.createdTime = salesReport.getCreatedTime();
    }

    
}
