package com.jee.clinichub.app.appointment.visitPayment.service;

import java.util.List;

import com.jee.clinichub.app.appointment.visitPayment.model.PaymentDTO;
import com.jee.clinichub.global.model.Status;


public interface PaymentService {

    List<PaymentDTO> getAllByInvoiceId(Long id);

    Status deleteById(Long id);

    Status saveOrUpdate(PaymentDTO paymentDTO);

    PaymentDTO getById(Long id);

    List<PaymentDTO> getAll();
    
}
