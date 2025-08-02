package com.jee.clinichub.app.admin.sales_folder.model;

import java.io.Serializable;

import com.jee.clinichub.app.admin.clinic.allclinic.model.Clinic;
import com.jee.clinichub.app.admin.promo.coupons.model.Coupons;
import com.jee.clinichub.app.admin.subscription.plan.model.Plan;
import com.jee.clinichub.app.payment.subscription_payment.model.SubscriptionPayment;
import com.jee.clinichub.app.payment.subscription_payment.model.SubscriptionPaymentDto;
import com.jee.clinichub.config.audit.Auditable;
import com.twilio.rest.events.v1.Subscription;

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

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "sales_report")   
public class SalesReport extends Auditable<String>  implements Serializable{


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

     @OneToOne
    @JoinColumn(
        name = "subscription_id"
    )
    private SubscriptionPayment subscriptionPayment;

    
    @OneToOne
    @JoinColumn(
        name = "coupons_id"
    )
    private Coupons coupons;

    @Column(name = "total_amount")
    private Long totalAmount;

    @Column(name = "payment_type")
    private String paymentType;

    @Column(name = "payment_status")
    private String paymentStatus;



    public SalesReport(SalesReportDto salesReportDto) {
        this.id = salesReportDto.getId();
        this.subscriptionPayment = salesReportDto.getSubscriptionPayment();
        this.coupons = salesReportDto.getCoupons();
        this.totalAmount = salesReportDto.getTotalAmount();
        this.paymentType = salesReportDto.getPaymentType();
        this.paymentStatus = salesReportDto.getPaymentStatus();

    }

}
