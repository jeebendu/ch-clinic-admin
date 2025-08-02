package com.jee.clinichub.app.payment.subscription_payment.model;

import java.io.Serializable;
import java.util.Date;

import org.hibernate.annotations.DynamicUpdate;
import com.jee.clinichub.app.admin.subscription.plan.model.Plan;
import com.jee.clinichub.config.audit.Auditable;
import com.jee.clinichub.global.tenant.model.Tenant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@DynamicUpdate
@Entity
@Table(name = "tenant_subscription")
public class SubscriptionPayment extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "payment_id")
    private String paymentId;

    @Column(name = " invoice_id")
    private String invoiceId;

    @Column(name = "end_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date endDate;

    @Column(name = "trail_end_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date trialEndsDate;

    @Column(name = "cencelled_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date cencelledDate;

    @Column(name = "next_billing_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date nextBillingDate;

    @Column(name = "start_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date startDate;

    @OneToOne
    @JoinColumn(name = "plan_id")
    private Plan plan;

    @OneToOne
    @JoinColumn(name = "tenant_id")
    private Tenant tenant;

    public SubscriptionPayment(SubscriptionPaymentDto subscriptionPaymentDto) {
        this.id = subscriptionPaymentDto.getId();
        this.paymentId = subscriptionPaymentDto.getPaymentId();
        this.invoiceId = subscriptionPaymentDto.getInvoiceId();
        this.plan = subscriptionPaymentDto.getPlan();
        this.tenant = subscriptionPaymentDto.getTenant();
        this.startDate=subscriptionPaymentDto.getStartDate();
        this.endDate=subscriptionPaymentDto.getEndDate();
        this.trialEndsDate=subscriptionPaymentDto.getTrialEndsDate();
        this.cencelledDate=subscriptionPaymentDto.getCencelledDate();
        this.nextBillingDate=subscriptionPaymentDto.getNextBillingDate();
}

}
