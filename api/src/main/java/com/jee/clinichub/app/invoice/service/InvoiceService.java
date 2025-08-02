package com.jee.clinichub.app.invoice.service;

import java.util.List;

import com.jee.clinichub.app.invoice.model.InvoiceDTO;
import com.jee.clinichub.global.model.Status;


public interface InvoiceService {

    List<InvoiceDTO> getAll();

    InvoiceDTO getById(Long id);

    Status saveOrUpdate(InvoiceDTO invoiceDTO);

    Status deleteById(Long id);

    List<InvoiceDTO> findAllByVisitId(Long id);

    List<InvoiceDTO> findAllByPatientId(Long patientId);
    
}
