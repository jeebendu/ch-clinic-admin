package com.jee.clinichub.app.payment.refund_payment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.payment.refund_payment.model.RefundPayment;



@Repository
public interface RefundPaymentRepo  extends JpaRepository<RefundPayment, Long> {
    
}
