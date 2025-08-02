package com.jee.clinichub.app.payment.subscriptionInvoice.model;
import java.io.Serializable;
import java.sql.Date;

import com.jee.clinichub.app.payment.type.model.PaymentType;
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
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="subscription_payment")
@ToString
public class TenantPayment extends Auditable<String> implements Serializable{
    

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
     @Column(name="amount")
    private Double amount;
     @OneToOne
     @JoinColumn(name = "payment_type_id")
     private PaymentType paymentType;

     @Column(name = "paid_on")
      private Date paidOn;


    public TenantPayment(TenantPaymentDTO tPaymentDTO){
        if(tPaymentDTO.getId()!=null){
            this.id=tPaymentDTO.getId();
        }

        this.amount = tPaymentDTO.getAmount();
        this.paymentType = tPaymentDTO.getPaymentType();
        this.paidOn = tPaymentDTO.getPaidOn();
    }

}