package com.jee.clinichub.app.appointment.visitPayment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.appointment.visitPayment.model.Payment;

@Repository
public interface PaymentRepo extends JpaRepository<Payment,Long> {

    List<Payment> findAllByInvoice_Id(Long id);
    
}
