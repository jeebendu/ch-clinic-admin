package com.jee.clinichub.app.payment.refund_payment.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicDto;
import com.jee.clinichub.app.payment.refund_payment.model.RefundPaymentDTO;
import com.jee.clinichub.app.payment.refund_payment.repository.RefundPaymentRepo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefundPaymentServiceImpl implements RefundPaymentService {
    @Autowired
    private final RefundPaymentRepo refundPaymentRepo;

 

       @Override
    public List<RefundPaymentDTO> getAllRefundPayment(){
       return refundPaymentRepo.findAll().stream()
                .map(RefundPaymentDTO::new)
                .toList();
    }
    
}
