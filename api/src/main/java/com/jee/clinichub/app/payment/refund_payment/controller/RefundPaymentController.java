package com.jee.clinichub.app.payment.refund_payment.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.admin.clinic.allclinic.model.ClinicDto;
import com.jee.clinichub.app.payment.refund_payment.model.RefundPaymentDTO;
import com.jee.clinichub.app.payment.refund_payment.service.RefundPaymentService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/refund/payment/amount")
public class RefundPaymentController {


@Autowired
private  RefundPaymentService refundPaymentService;

     @GetMapping(value="/list")
    public List<RefundPaymentDTO> getAllRefundPayment(){
        List<RefundPaymentDTO> refundList = refundPaymentService.getAllRefundPayment();
        return refundList;
    }
    
}
